import api from "./api";

export interface UploadResponse {
  url: string;
  fileName: string;
  size: number;
  contentType: string;
}

export const mediaService = {
  async upload(file: File): Promise<UploadResponse> {
    const form = new FormData();
    form.append("file", file);
    const res = await api.post("/media/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },
};