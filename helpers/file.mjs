import fs from "node:fs";

export const deleteFile = (filePath) => {
  fs.unlink(filePath, (error) => {
    if (error) throw error;
  });
};
