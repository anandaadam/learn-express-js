import fs from "fs";

export const requestHandler = function (req, res) {
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>NodeJS | Home</title></head>");
    res.write("<body><h1 style='text-align: center'>Hello, World! Welcome to the NodeJS server</h1></body>");
    res.write("</html>");
    return res.end();
  }

  if (url === "/users") {
    res.write("<html>");
    res.write("<head><title>NodeJS | Users</title></head>");
    res.write("<body><ul><li>User 1</li></ul></body>");
    res.write("</html>");
    return res.end();
  }

  if (url === "/register") {
    res.write("<html>");
    res.write("<head><title>Node JS | Register</title></head>");
    res.write("<body><form action='/create-users' method='POST'><input type='text' name='username'><button type='submit'>Enter</button></form></body>");
    res.write("</html>");
    return res.end();
  }

  if (url === "/create-users" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });

    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      console.log(parsedBody);
      fs.writeFile("message.txt", parsedBody.split("=")[1], (err) => {
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }
};
