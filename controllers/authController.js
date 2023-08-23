import { db } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { username, password, email,contact } = req.body;

  // console.log(req.body);

  //CHECK existing user
  const q = "SELECT * FROM users WHERE email = ? OR username = ?";

  db.query(q, [email, username], async (err, data) => {
    if (err) {
      return res.status(400).json({
        status: "fail",
        mesage: err,
      });
    }

    if (data.length > 0) {
      return res.status(200).json({
        status: "success",
        message: "user already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const q = "INSERT INTO users(`username`,`email`,`password`,`contact`) VALUES (?) ";

    const values = [username, email, hashedPassword,contact];

    db.query(q, [values], (err, data) => {
      if (err) {
        return res.status(400).json({
          status: "fail",
          message: err,
        });
      }

      return res.status(200).json({
        status: "success",
        message: "user created Succesfuly",
        data,
      });
    });
  });

  //   res.json({
  //     status: "status",
  //     mesage: "registered",
  //   });
};

export const login = async (req, res) => {
  const { password, username } = req.body;
  // console.log(req.body);

  const q = "SELECT * FROM users WHERE  username = ? ";

  db.query(q, [username], async (err, data) => {
    if (err) {
      return res.status(400).json({
        status: "fail",
        message: err,
      });
    }

    // console.log(data);

    if (data.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: " user does not exist",
      });
    }

    //check password
    const isCorrectPassword = await bcrypt.compare(password, data[0].password);

    if (!isCorrectPassword) {
      return res.status(400).json({
        status: "fail",
        message: "Wrong user or Password",
      });
    }

    const token = jwt.sign({ id: data[0].id }, "jwtkey");
    // const {password,...other}= data[0]

    res.json({
      status: "success",
      message: "sucessfuly logged in",
      token: token,
      data: {
        id: data[0].id,
        username: data[0].username,
        email: data[0].email,
        contact: data[0].contact
      },
    });



    // res
    //   .cookie("access_token", token, {
    //     httpOnly: true,
    //   })
    //   .status(200)
    //   .json({
    //     status: "success",
    //     message: "sucessfuly logged in",
    //     token: token,
    //     data,
    //   });
  });
};

export const logout = (req, res) => {
  res.json({
        status: "success",
        mesage: "User has been logged out",
      });
  //     .clearCookie("access_token", {
  //       sameSite: "none",
  //       secure: true,
  //     })
  //     .json({
  //       status: "success",
  //       mesage: "User has been logged out",
  //     });
};
