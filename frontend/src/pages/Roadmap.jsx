import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
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
  Progress,
  HStack,
  Image,
  Checkbox,
  Spinner,
} from "@chakra-ui/react";
import { LuMoon, LuSun } from "react-icons/lu";
import { useColorMode } from "../components/ui/color-mode";
import { CiLogout } from "react-icons/ci";
import { FaUserCircle } from "react-icons/fa";
import { RiGeminiFill } from "react-icons/ri";
import { GoogleGenerativeAI } from "@google/generative-ai";

const ai = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);

function Roadmap() {
  const { slug } = useParams();
  const [roadmap, setroadmap] = useState(null);
  const [checkeditems, setcheckeditems] = useState([]);
  const navigate = useNavigate();
  const { toggleColorMode, colorMode } = useColorMode();
  const [open, setopen] = useState(false);
  const [openn, setopenn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const { onOpen } = useDisclosure();
  const [user, setuser] = useState(null);
  useEffect(() => {
    const storeduser = localStorage.getItem("userInfo");
    if (storeduser) {
      setuser(JSON.parse(storeduser));
    }
  }, []);

  //const user = JSON.parse(localStorage.getItem("userInfo"));
  // const storeduser = localStorage.getItem("userInfo");
  // const [user, setuser] = useState(storeduser ? JSON.parse(storeduser) : null);
  useEffect(() => {
    if (!user || !slug) return;
    console.log("user is", user);
    console.log("slug is", slug);
    const fetchroadmap = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/roadmaps/${slug}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        //console.log("Fetched data", data);

        setroadmap(data);
        const { data: progressres } = await axios.get(`/api/progress/${slug}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        console.log("progress data", progressres);

        // const userprogress = progressres.data?.progress?.find(
        //   (p) => p.roadmapslug === slug
        // );
        //const completed = userprogress?.completedResources || [];
        const completed = progressres?.completedResources || [];
        const initialcheck = data.resources.map((r) =>
          completed.includes(r.title)
        );
        console.log("inital checked itens", initialcheck);

        setcheckeditems(initialcheck);
        setLoading(false);
      } catch (error) {
        console.log("error while fetching roadmap", error);
      }
    };
    if (user && slug) fetchroadmap();
  }, [slug, user]);

  const handlecheckbox = async (index) => {
    const updated = [...checkeditems];
    updated[index] = !updated[index];
    setcheckeditems(updated);

    const completedResources = roadmap.resources
      .filter((_, i) => updated[i])
      .map((r) => r.title);
    try {
      await axios.put(
        `/api/progress/${slug}`,
        { roadmapslug: slug, completedResources },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
    } catch (error) {
      console.log("error saving progress", error);
    }
  };
  const completedcount = checkeditems.filter(Boolean).length;
  const totalCount = roadmap?.resources?.length || 0;
  const progressvalue = totalCount ? (completedcount / totalCount) * 100 : 0;
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
  const logout = () => {
    navigate("/search");
  };
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
          <IconButton onClick={logout} variant="ghost" aria-label="Logout">
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
      {/* <Progress.Root
        value={progressvalue}
        maxW="md"
        max={100}
        min={0}
        shape="rounded"
        variant="subtle"
        animated="true"
      >
        <HStack gap="5">
          <Progress.Label fontSize="lg" fontWeight="bold">
            Progress
          </Progress.Label>
          <Progress.Track flex="1">
            <Progress.Range />
          </Progress.Track>
          <Progress.ValueText fontSize="lg" fontWeight="bold">
            {progressvalue}
          </Progress.ValueText>
        </HStack>
      </Progress.Root> */}

      {loading ? (
        <Flex justify="center" align="center" py={20}>
          <Spinner size="xl" />
        </Flex>
      ) : (
        <Flex
          paddingRight="20rem"
          py={10}
          justify="center"
          gap={10}
          align="start"
        >
          <Box w="350px" position="sticky" top="100px">
            <Progress.Root
              value={Math.round(progressvalue)}
              maxW="md"
              max={100}
              min={0}
              shape="rounded"
              variant="subtle"
              animated="true"
            >
              <HStack gap="5">
                <Progress.Label fontSize="lg" fontWeight="bold">
                  Progress
                </Progress.Label>
                <Progress.Track flex="1">
                  <Progress.Range />
                </Progress.Track>
                <Progress.ValueText fontSize="lg" fontWeight="bold">
                  {progressvalue.toFixed(0)}%
                </Progress.ValueText>
              </HStack>
            </Progress.Root>
          </Box>

          <Flex direction="column" align="center" maxW="700px" w="full">
            {roadmap && (
              <>
                <Box
                  boxShadow="lg"
                  p={4}
                  borderRadius="md"
                  bg={colorMode === "dark" ? "gray.700" : "white"}
                  mb={6}
                  _hover={{
                    cursor: "pointer",
                    transform: "scale(1.02)",
                    transition: "0.3s",
                  }}
                >
                  <Text fontSize="2xl" fontWeight="bold" mb={2}>
                    {roadmap.title}
                  </Text>
                  <Image
                    src={roadmap.imageUrl}
                    alt={roadmap.title}
                    borderRadius="md"
                    width="400px"
                  />
                </Box>
                <Box w="100%" maxW="600px">
                  {roadmap &&
                    roadmap.resources &&
                    checkeditems.length > 0 &&
                    roadmap.resources.map((r, i) => (
                      <Box
                        key={i}
                        mb={4}
                        p={4}
                        borderWidth={1}
                        borderRadius="md"
                        bg={colorMode === "dark" ? "gray.700" : "gray.300"}
                      >
                        <Flex align="center" gap={2} mb={2} wrap="wrap">
                          <Checkbox.Root
                            checked={checkeditems[i]}
                            onCheckedChange={() => handlecheckbox(i)}
                            bg={colorMode === "dark" ? "black" : "gray.600"}
                          >
                            <Checkbox.HiddenInput />
                            <Checkbox.Control />
                          </Checkbox.Root>

                          <Text fontWeight="bold">{r.title}</Text>
                        </Flex>
                        <Text>
                          Video:{" "}
                          <a
                            href={r.linka}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#3182ce" }}
                          >
                            Watch
                          </a>
                        </Text>
                        <Text>
                          Article:{" "}
                          <a
                            href={r.linkb}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#3182ce" }}
                          >
                            Read
                          </a>
                        </Text>
                      </Box>
                    ))}
                </Box>
              </>
            )}
          </Flex>
        </Flex>
      )}
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
        mt="20rem"
        py={4}
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

export default Roadmap;
