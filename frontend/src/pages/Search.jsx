import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Input,
  Button,
  IconButton,
  ClientOnly,
  Drawer,
  CloseButton,
  Skeleton,
  Popover,
  Portal,
  PopoverCloseTrigger,
  PopoverHeader,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import { LuMoon, LuSun } from "react-icons/lu";
import { useColorMode } from "../components/ui/color-mode";
import { toaster } from "../components/ui/toaster";
import { CiLogout } from "react-icons/ci";
import { FaUserCircle } from "react-icons/fa";
import { RiGeminiFill } from "react-icons/ri";

import { GoogleGenerativeAI } from "@google/generative-ai";

const ai = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);

function Search() {
  const [query, setquery] = useState("");
  const navigate = useNavigate();
  const { toggleColorMode, colorMode } = useColorMode();
  const [open, setopen] = useState(false);
  const [openn, setopenn] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  const { onOpen } = useDisclosure();
  const fullText =
    "👋 Welcome Aspiring Developers!In today's ever-evolving tech landscape, you're faced with countless tools, languages, and frameworks to explore. It can be overwhelming to choose where to start, what to focus on, and which resources truly add value.That's where we come in.This platform is crafted to guide you—whether you're diving into web development, data science, mobile apps, or any other field. You'll find structured roadmaps, hand-picked resources, and step-by-step guidance tailored to your goals.Your journey in tech doesn't have to be confusing. Let this roadmap be your compass. 🚀";
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const pauseAfterTyping = 1500;
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
  const handlesearch = () => {
    if (query.trim() !== "") {
      navigate(`/roadmap/${query.trim().toLowerCase()}`);
    }
  };
  const handlelogout = () => {
    localStorage.removeItem("userInfo");
    toaster.create({
      title: "Logged out successfully",
      description: "Logged out",
      type: "info",
      duration: 5000,
      closable: true,
    });
    navigate("/");
  };
  const handlegeminiquery = async () => {
    setAiResponse("");
    const disallowedTopics = ["weather", "sports", "food", "politics"];
    if (
      disallowedTopics.some((topic) => aiQuery.toLowerCase().includes(topic))
    ) {
      setAiResponse(
        "❌ I can only assist with development and roadmap-related questions."
      );

      return;
    }
    try {
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
      const chat = model.startChat({
        history: [],
        generationConfig: { temperature: 0.7 },
        systemInstruction: {
          parts: [
            {
              text: "You are an expert assistant that only answers questions related to roadmaps, programming languages, development stacks, and career paths in software development. Do not answer anything outside of these topics.",
            },
          ],
        },
      });
      const result = await chat.sendMessage(aiQuery);

      const text = await result.response.text();
      setAiResponse(text);
    } catch (err) {
      setAiResponse("❌ Failed to fetch response from Gemini.");
      console.error(err);
    }
  };

  const user = JSON.parse(localStorage.getItem("userInfo"));
  return (
    <Box
      minH="100vh"
      bg={colorMode === "dark" ? "#2f0553" : "gray.200"}
      color={colorMode === "dark" ? "white" : "black"}
    >
      <Flex
        justify="space-between"
        align="center"
        px={6}
        py={4}
        boxShadow="md"
        bg={colorMode === "dark" ? "#2f0553" : "gray.400"}
      >
        <Text fontWeight="bold" fontSize="xl">
          Pathpilot
        </Text>
        <Text fontSize="lg" fontWeight="semibold">
          Welcome Developers
        </Text>
        <Flex gap={4} align="center">
          <ClientOnly fallback={<Skeleton boxSize="8" />}>
            <IconButton
              onClick={toggleColorMode}
              variant="ghost"
              size="sm"
              aria-label="Toggle Theme"
            >
              {colorMode === "light" ? <LuSun /> : <LuMoon />}
            </IconButton>
          </ClientOnly>
          <IconButton
            onClick={handlelogout}
            variant="ghost"
            aria-label="Logout"
          >
            <CiLogout />
          </IconButton>
          <Popover.Root
            open={open}
            onOpenChange={(e) => setopen(e.open)}
            positioning={{ placement: "bottom-end" }}
            colorPalette="blue"
          >
            <Popover.Trigger asChild>
              <IconButton variant="ghost" aria-label="Profile">
                <FaUserCircle />
              </IconButton>
            </Popover.Trigger>
            <Portal>
              <Popover.Positioner>
                <Popover.Content
                  bg="gray.800"
                  color="white"
                  borderColor="gray.600"
                >
                  <Popover.Arrow />
                  <PopoverCloseTrigger />
                  <PopoverHeader fontWeight="bold">User Info</PopoverHeader>
                  <Popover.Body>
                    <div>
                      <strong>Name:</strong> {user?.name}
                    </div>
                    <div>
                      <strong>Email:</strong> {user?.email}
                    </div>
                  </Popover.Body>
                </Popover.Content>
              </Popover.Positioner>
            </Portal>
          </Popover.Root>
        </Flex>
      </Flex>
      <Box w="100%" textAlign="left" px={0}>
        <Text
          color={colorMode === "dark" ? "white" : "black"}
          fontSize="2xl"
          fontWeight="semibold"
          whiteSpace="pre-wrap"
          wordBreak="break-word"
          lineHeight="1.6"
        >
          {typedText}
          <span className="blinking-cursor">|</span>
        </Text>
      </Box>
      <Flex
        direction="column"
        align="center"
        justify="center"
        position="absolute"
        top="25%"
        left="50%"
        transform="translate(-50%, -50%)"
        zIndex="2"
        w="100%"
        mt="17rem"
        px={4}
      >
        <Text fontSize="4xl" mb={6} fontWeight="bold" textAlign="center">
          Search for a Roadmap
        </Text>
        <Flex gap={2} w="100%" maxW="500px" justify="center">
          <Input
            placeholder="e.g mern,flutter"
            value={query}
            onChange={(e) => setquery(e.target.value)}
            w="100%"
            bg={colorMode == "dark" ? "gray.700" : "black"}
            color={colorMode == "dark" ? "white" : "white"}
            size="lg"
            height="45px"
            maxW="600px"
            mb={4}
            fontSize="lg"
          />
          <Button
            bg="black"
            color="white"
            _hover={{ bg: "gray.800" }}
            size="lg"
            height="45px"
            px={10}
            fontWeight="bold"
            onClick={handlesearch}
          >
            Search
          </Button>
        </Flex>
      </Flex>

      <Drawer.Root open={openn} onOpenChange={(e) => setopenn(e.open)}>
        <Drawer.Trigger asChild>
          <IconButton
            position="fixed"
            bottom="80px"
            right="30px"
            borderRadius="full"
            colorScheme="purple"
            size="lg"
            aria-label="AI Assisstant"
            onClick={onOpen}
          >
            <RiGeminiFill />
          </IconButton>
        </Drawer.Trigger>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title
                  className={`font-bold ${
                    colorMode === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  Pathpilot Assisstant
                </Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <Text mb={4}>
                  Ask your programming or roadmap-related questions here.
                </Text>
                <Input
                  placeholder="e.g., What is the MERN stack?"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  mb={3}
                  bg={colorMode == "dark" ? "white" : "gray.400"}
                  color="black"
                />
                <Button
                  colorScheme="purple"
                  size="sm"
                  onClick={handlegeminiquery}
                  mb={4}
                  color={colorMode == "dark" ? "black" : "white"}
                  bg={colorMode == "dark" ? "gray.600" : "black"}
                >
                  Ask Pathpilot
                </Button>
                {aiResponse && (
                  <Box
                    p={3}
                    borderWidth="1px"
                    borderRadius="md"
                    bg={colorMode == "dark" ? "white" : "gray.300"}
                    color="black"
                    fontSize="sm"
                  >
                    {aiResponse}
                  </Box>
                )}
              </Drawer.Body>

              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
      <Flex
        justify="center"
        align="center"
        mt="30rem"
        py={4}
        position="absolute"
        bottom="0"
        w="100%"
        fontWeight="bold"
        bg={colorMode === "dark" ? "black" : "gray.400"}
      >
        <Text fontSize="sm">© 2025 Pathpilot. All rights reserved.</Text>
      </Flex>
    </Box>
  );
}

export default Search;
