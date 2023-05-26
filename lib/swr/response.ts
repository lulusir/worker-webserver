export interface SerializedResponse {
  status: number;
  statusText: string;
  headers: { [key: string]: string };
  body: string | null;
}

export function serializeResponse(
  response: Response
): Promise<SerializedResponse> {
  const serialized: SerializedResponse = {
    status: response.status,
    statusText: response.statusText,
    headers: {},
    body: null,
  };

  response.headers.forEach((value: string, name: string) => {
    serialized.headers[name] = value;
  });

  const contentType = response.headers.get("content-type");
  if (contentType) {
    if (contentType.includes("application/json")) {
      return response.json().then((json: any) => {
        serialized.body = JSON.stringify(json);
        return serialized;
      });
    } else if (contentType.includes("text/plain")) {
      return response.text().then((body: string) => {
        serialized.body = body;
        return serialized;
      });
    } else if (
      contentType.includes("application/octet-stream") ||
      contentType.includes("image/") ||
      contentType.includes("audio/") ||
      contentType.includes("video/")
    ) {
      return response.blob().then((blob: Blob) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            serialized.body = reader.result as string;
            resolve(serialized);
          };
          reader.readAsDataURL(blob);
        });
      });
    } else if (contentType.includes("application/octet-stream")) {
      return response.arrayBuffer().then((buffer: ArrayBuffer) => {
        serialized.body = bufferToString(buffer);
        return serialized;
      });
    }
  }

  return response.text().then((body: string) => {
    serialized.body = body;
    return serialized;
  });
}

function bufferToString(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let result = "";
  for (let i = 0; i < bytes.length; i++) {
    result += String.fromCharCode(bytes[i]);
  }
  return result;
}

export function deserializeResponse(serialized: SerializedResponse): Response {
  const headers = new Headers(serialized.headers);

  const responseInit: ResponseInit = {
    status: serialized.status,
    statusText: serialized.statusText,
    headers: headers,
  };

  if (serialized.body !== null) {
    const contentType = headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const body = JSON.parse(serialized.body);
      return new Response(JSON.stringify(body), responseInit);
    } else if (
      contentType &&
      contentType.includes("application/octet-stream")
    ) {
      const body = stringToBuffer(serialized.body);
      return new Response(body, responseInit);
    } else {
      return new Response(serialized.body, responseInit);
    }
  } else {
    return new Response(null, responseInit);
  }
}

function stringToBuffer(str: string): ArrayBuffer {
  const buffer = new ArrayBuffer(str.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < str.length; i++) {
    view[i] = str.charCodeAt(i);
  }
  return buffer;
}
