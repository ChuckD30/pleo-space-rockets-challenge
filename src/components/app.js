import React from "react";
import { Routes, Route } from "react-router-dom";
import { Flex, Text, Box, useColorMode } from "@chakra-ui/core";
import { Moon, Sun } from "react-feather";
import { Link } from "react-router-dom";

import Launches from "./launches";
import Launch from "./launch";
import Home from "./home";
import LaunchPads from "./launch-pads";
import LaunchPad from "./launch-pad";
import ParticleBackground from "./particle-background";

export default function App() {
  const { colorMode } = useColorMode();
  return (
    <div>
      {colorMode === "dark" && <ParticleBackground />}
      <div
        style={{
          position: "relative",
          zIndex: "1",
        }}
      >
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/launches" element={<Launches />} />
          <Route path="/launches/:launchId" element={<Launch />} />
          <Route path="/launch-pads" element={<LaunchPads />} />
          <Route path="/launch-pads/:launchPadId" element={<LaunchPad />} />
        </Routes>
      </div>
    </div>
  );
}

function NavBar() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="6"
      bg="gray.800"
      color="white"
    >
      <Text
        fontFamily="mono"
        letterSpacing="2px"
        fontWeight="bold"
        fontSize="lg"
        cursor={"pointer"}
        as={Link}
        to={`/`}
      >
        ¡SPACE·R0CKETS!
      </Text>
      <Box
        as={colorMode === "dark" ? Sun : Moon}
        size="20px"
        onClick={() => toggleColorMode()}
        cursor={"pointer"}
      />
    </Flex>
  );
}
