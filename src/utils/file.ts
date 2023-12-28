import fs from "fs";
import path from "path";

export const getUserDataDirectory = () => {
  return process.env.USER_DATA || "";
};

export const relativeToAbsolutePath = (relativePath: string) => {
  return path.join(getUserDataDirectory(), relativePath);
};

// export const readFile = async (path, isAbsolute = false) => {
//   return new Promise((resolve, reject) => {
//     fs.readFile(
//       isAbsolute ? relativeToAbsolutePath(path) : path,
//       (err, data) => {
//         if (err) return reject(err);

//         resolve(data);
//       }
//     );
//   });
// };

export const makeDirRecursive = async (path: fs.PathLike) => {
  return new Promise((resolve) => {
    fs.mkdir(path, { recursive: true }, (err, fileName) => {
      if (err) {
        throw err;
      }
      resolve(fileName);
    });
  });
};

export const extractExtension = (fileName: {
  split: (arg0: string) => never[];
}) => {
  const sections = fileName?.split(".") || [];

  return sections.length > 0 ? sections[sections.length - 1] : "";
};
