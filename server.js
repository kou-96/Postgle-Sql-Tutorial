const express = require("express");
const pool = require("./db");
const app = express();
const PORT = 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Express");
});

//ユーザー情報の全てを取得する。
app.get("/users", (req, res) => {
  pool.query("SELECT * FROM users", (error, results) => {
    if (error) throw error;
    return res.status(200).json(results.rows);
  });
});

app.get("/users/:id", (req, res) => {
  const id = req.params.id;

  pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
    if (error) throw error;
    return res.status(200).json(results.rows);
  });
});

app.post("/users", (req, res) => {
  const { name, email, age } = req.body;

  pool.query(
    "SELECT u FROM  users u WHERE u.email = $1",
    [email],
    (error, results) => {
      if (results.rows.length) {
        return res.status(409).send("すでにユーザーが存在しています");
      }

      pool.query(
        "INSERT INTO users(name, email, age) Values($1, $2, $3)",
        [name, email, age],
        (error, results) => {
          if (error) throw error;
          return res.status(201).send("ユーザーの作成に成功しました");
        }
      );
    }
  );
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;

  pool.query("SELECT * FROM  users WHERE id = $1", [id], (error, results) => {
    if (error) throw error;

    const isUserNotExist = results.rows.length;
    if (!isUserNotExist) {
      return res.status(404).send("ユーザーが存在しません");
    }
  });

  pool.query("DELETE FROM users WHERE id = $1", [id], (error, results) => {
    if (error) throw error;
    return res.status(200).send("削除に成功しました");
  });
});

app.put("/users/:id", (req, res) => {
  const id = req.params.id;
  const name = req.body.name;

  pool.query("SELECT * FROM  users WHERE id = $1", [id], (error, results) => {
    if (error) throw error;

    const isUserNotExist = results.rows.length;
    if (!isUserNotExist) {
      return res.status(404).send("ユーザーが存在しません");
    }
  });

  pool.query(
    "UPDATE users SET name = $1 WHERE id = $2",
    [name, id],
    (error, results) => {
      if (error) throw error;
      return res.status(200).send("更新に成功しました");
    }
  );
});

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
