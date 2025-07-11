import React, { useState, useEffect } from "react";
import { toaster } from "../components/ui/toaster";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Field,
  Fieldset,
  Input,
  InputGroup,
  Stack,
} from "@chakra-ui/react";

function Login() {
  const [show, setshow] = useState(false);
  const [email, setemail] = useState("");
  const [password, setpass] = useState("");
  const [loading, setloading] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const fullText = "👋 Hello Developers! Hurry and Sign Up Now! 🚀";
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const pauseAfterTyping = 1500;
  const navigate = useNavigate();

  useEffect(() => {
    let timer;

    if (!isDeleting && charIndex < fullText.length) {
      timer = setTimeout(() => {
        setTypedText((prev) => prev + fullText.charAt(charIndex));
        setCharIndex((prev) => prev + 1);
      }, typingSpeed);
    } else if (isDeleting && charIndex > 0) {
      timer = setTimeout(() => {
        setTypedText((prev) => prev.slice(0, -1));
        setCharIndex((prev) => prev - 1);
      }, deletingSpeed);
    } else {
      // Pause after complete typing or deleting
      timer = setTimeout(() => {
        setIsDeleting((prev) => !prev);
      }, pauseAfterTyping);
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting]);
  const handleclick = () => setshow(!show);
  const submithandler = async (e) => {
    e.preventDefault();
    setloading(true);
    if (!email || !password) {
      toaster.create({
        title: "All the fields required",
        description: "Please fill all the fields",
        type: "info",
        duration: 5000,
        closable: true,
      });
      setloading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "https://pathpilot-backend-9i1n.onrender.com/api/users/login",
        { email, password },
        config
      );
      toaster.create({
        description: "Login successful",
        type: "info",
        duration: 5000,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setloading(false);
      navigate("/search");
    } catch (error) {
      toaster.create({
        title: "Error occured",
        description: error.response.data.message || "something went wrong",
        type: "info",
        duration: 5000,
      });
      setloading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        padding: "1rem",
      }}
    >
      <div
        style={{
          color: "white",
          fontSize: "3rem",
          fontWeight: "bold",
          width: "40%",
          paddingRight: "4rem",
        }}
      >
        <span>{typedText}</span>
        <span className="blinking-cursor">|</span>
      </div>
      <form>
        <Fieldset.Root
          size="lg"
          style={{
            backgroundColor: "black",
            padding: "5rem",
            borderRadius: "10px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            width: "500%",
            maxWidth: "500px",
          }}
        >
          <Stack align="center" textAlign="center" mb="4">
            <Fieldset.Legend
              style={{ color: "white", fontSize: "4rem", fontWeight: "bold" }}
            >
              LOGIN
            </Fieldset.Legend>
            <Fieldset.HelperText
              style={{
                color: "white",
                fontSize: "1.2rem",
                paddingTop: "1.5rem",
              }}
            >
              Please provide your details below.
            </Fieldset.HelperText>
          </Stack>

          <Fieldset.Content>
            {/* <Field.Root orientation="horizontal" id="namefield">
                <Field.Label
                  htmlFor="signup-name"
                  style={{ fontSize: "17px", fontWeight: "bold" }}
                >
                  Name
                </Field.Label>
                <Input
                  id="signup-name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setname(e.target.value)}
                  style={{
                    backgroundColor: "#1f1f1f",
                    border: "1px solid #444",
                    color: "white",
                    padding: "0.75rem",
                    borderRadius: "6px",
                  }}
                />
              </Field.Root> */}

            <Field.Root orientation="horizontal" id="emailfield">
              <Field.Label
                htmlFor="signup-email"
                style={{ fontSize: "17px", fontWeight: "bold" }}
              >
                Email
              </Field.Label>
              <Input
                id="signup-email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                style={{
                  backgroundColor: "#1f1f1f",
                  border: "1px solid #444",
                  color: "white",
                  padding: "0.75rem",
                  borderRadius: "6px",
                }}
              />
            </Field.Root>

            <Field.Root orientation="horizontal" id="passfield">
              <Field.Label
                htmlFor="signup-pass"
                style={{ fontSize: "17px", fontWeight: "bold" }}
              >
                Password
              </Field.Label>
              <InputGroup
                flex="1"
                endElement={
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={handleclick}
                    colorPalette="blue"
                    style={{
                      backgroundColor: "#2563eb",
                      color: "white",
                      fontWeight: "bold",
                      padding: "0.75rem",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#1e40af")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#2563eb")
                    }
                  >
                    {show ? "Hide" : "Show"}
                  </Button>
                }
              >
                <Input
                  id="signup-pass"
                  type={show ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setpass(e.target.value)}
                  style={{
                    backgroundColor: "#1f1f1f",
                    border: "1px solid #444",
                    color: "white",
                    padding: "0.75rem",
                    borderRadius: "6px",
                  }}
                />
              </InputGroup>
            </Field.Root>
            {/* <Field.Root orientation="horizontal" id="conpassfield">
                <Field.Label
                  htmlFor="signup-conpass"
                  style={{ fontSize: "17px", fontWeight: "bold" }}
                >
                  Confirm
                </Field.Label>
                <InputGroup
                  flex="1"
                  endElement={
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={handleclick}
                      colorPalette="blue"
                      style={{
                        backgroundColor: "#2563eb",
                        color: "white",
                        fontWeight: "bold",
                        padding: "0.75rem",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "#1e40af")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = "#2563eb")
                      }
                    >
                      {show ? "Hide" : "Show"}
                    </Button>
                  }
                >
                  <Input
                    id="consignup-pass"
                    type={show ? "text" : "password"}
                    placeholder="Confirm the password"
                    value={confirmpassword}
                    onChange={(e) => setconfirm(e.target.value)}
                    style={{
                      backgroundColor: "#1f1f1f",
                      border: "1px solid #444",
                      color: "white",
                      padding: "0.75rem",
                      borderRadius: "6px",
                    }}
                  />
                </InputGroup>
              </Field.Root> */}
          </Fieldset.Content>

          <Button
            colorPalette="blue"
            width="100%"
            style={{
              marginTop: "30px",
              backgroundColor: "#2563eb",
              color: "white",
              fontWeight: "bold",
              padding: "0.75rem",
              borderRadius: "8px",
              cursor: "pointer",
              border: "none",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#1e40af")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#2563eb")}
            onClick={submithandler}
            loading={loading}
          >
            Login
          </Button>
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <span style={{ color: "white" }}>
              Don't have an account?{" "}
              <Link
                to="/"
                style={{ color: "#3b82f6", textDecoration: "underline" }}
              >
                Sign up here
              </Link>
            </span>
          </div>
        </Fieldset.Root>
      </form>
    </div>
  );
}

export default Login;
