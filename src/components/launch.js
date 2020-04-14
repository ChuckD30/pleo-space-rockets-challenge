import React from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { format as timeAgo } from "timeago.js";
import { Watch, MapPin, Navigation, Layers } from "react-feather";
import {
  Flex,
  Heading,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  Box,
  Text,
  Spinner,
  Image,
  Link,
  Stack,
  AspectRatioBox,
  StatGroup,
} from "@chakra-ui/core";

import { useSpaceX } from "../utils/use-space-x";
import { formatDateTime } from "../utils/format-date";
import Error from "./error";
import Breadcrumbs from "./breadcrumbs";

export default function Launch() {
  let { launchId } = useParams();
  const { data: launch, error } = useSpaceX(`/launches/${launchId}`);

  if (error) return <Error />;
  if (!launch) {
    return (
      <Flex justifyContent="center" alignItems="center" minHeight="50vh">
        <Spinner size="lg" />
      </Flex>
    );
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "Launches", to: ".." },
          { label: `#${launch.flight_number}` },
        ]}
      />
      <Header launch={launch} />
      <Box m={[3, 6]}>
        <TimeAndLocation launch={launch} />
        <RocketInfo launch={launch} />
        <Text color="gray.700" fontSize={["md", null, "lg"]} my="8">
          {launch.details}
        </Text>
        <Video launch={launch} />
        <Gallery images={launch.links.flickr_images} />
      </Box>
    </div>
  );
}

function Header({ launch }) {
  return (
    <Flex
      bgImage={`url(${launch.links.flickr_images[0]})`}
      bgPos="center"
      bgSize="cover"
      bgRepeat="no-repeat"
      minHeight="30vh"
      position="relative"
      p={[2, 6]}
      alignItems="flex-end"
      justifyContent="space-between"
    >
      <Image
        position="absolute"
        top="5"
        right="5"
        src={launch.links.mission_patch_small}
        height={["85px", "150px"]}
        objectFit="contain"
        objectPosition="bottom"
      />
      <Heading
        color="white"
        display="inline"
        backgroundColor="#718096b8"
        fontSize={["lg", "5xl"]}
        px="4"
        py="2"
        borderRadius="lg"
      >
        {launch.mission_name}
      </Heading>
      <Stack isInline spacing="3">
        <Badge variantColor="purple" fontSize={["xs", "md"]}>
          #{launch.flight_number}
        </Badge>
        {launch.launch_success ? (
          <Badge variantColor="green" fontSize={["xs", "md"]}>
            Successful
          </Badge>
        ) : (
          <Badge variantColor="red" fontSize={["xs", "md"]}>
            Failed
          </Badge>
        )}
      </Stack>
    </Flex>
  );
}

function TimeAndLocation({ launch }) {
  return (
    <SimpleGrid columns={[1, 1, 2]} borderWidth="1px" p="4" borderRadius="md">
      <Stat>
        <StatLabel display="flex">
          <Box as={Watch} width="1em" />{" "}
          <Box ml="2" as="span">
            Launch Date
          </Box>
        </StatLabel>
        <StatNumber fontSize={["md", "xl"]}>
          {formatDateTime(launch.launch_date_local)}
        </StatNumber>
        <StatHelpText>{timeAgo(launch.launch_date_utc)}</StatHelpText>
      </Stat>
      <Stat>
        <StatLabel display="flex">
          <Box as={MapPin} width="1em" />{" "}
          <Box ml="2" as="span">
            Launch Site
          </Box>
        </StatLabel>
        <StatNumber fontSize={["md", "xl"]}>
          <Link
            as={RouterLink}
            to={`/launch-pads/${launch.launch_site.site_id}`}
          >
            {launch.launch_site.site_name_long}
          </Link>
        </StatNumber>
        <StatHelpText>{launch.launch_site.site_name}</StatHelpText>
      </Stat>
    </SimpleGrid>
  );
}

function RocketInfo({ launch }) {
  const cores = launch.rocket.first_stage.cores;

  return (
    <SimpleGrid
      columns={[1, 1, 2]}
      borderWidth="1px"
      mt="4"
      p="4"
      borderRadius="md"
    >
      <Stat>
        <StatLabel display="flex">
          <Box as={Navigation} width="1em" />{" "}
          <Box ml="2" as="span">
            Rocket
          </Box>
        </StatLabel>
        <StatNumber fontSize={["md", "xl"]}>
          {launch.rocket.rocket_name}
        </StatNumber>
        <StatHelpText>{launch.rocket.rocket_type}</StatHelpText>
      </Stat>
      <StatGroup>
        <Stat>
          <StatLabel display="flex">
            <Box as={Layers} width="1em" />{" "}
            <Box ml="2" as="span">
              First Stage
            </Box>
          </StatLabel>
          <StatNumber fontSize={["md", "xl"]}>
            {cores.map((core) => core.core_serial).join(", ")}
          </StatNumber>
          <StatHelpText>
            {cores.every((core) => core.land_success)
              ? cores.length === 1
                ? "Recovered"
                : "All recovered"
              : "Lost"}
          </StatHelpText>
        </Stat>
        <Stat>
          <StatLabel display="flex">
            <Box as={Layers} width="1em" />{" "}
            <Box ml="2" as="span">
              Second Stage
            </Box>
          </StatLabel>
          <StatNumber fontSize={["md", "xl"]}>
            Block {launch.rocket.second_stage.block}
          </StatNumber>
          <StatHelpText>
            Payload:{" "}
            {launch.rocket.second_stage.payloads
              .map((payload) => payload.payload_type)
              .join(", ")}
          </StatHelpText>
        </Stat>
      </StatGroup>
    </SimpleGrid>
  );
}

function Video({ launch }) {
  return (
    <AspectRatioBox maxH="400px" ratio={1.7}>
      <Box
        as="iframe"
        title={launch.mission_name}
        src={`https://www.youtube.com/embed/${launch.links.youtube_id}`}
        allowFullScreen
      />
    </AspectRatioBox>
  );
}

function Gallery({ images }) {
  return (
    <SimpleGrid my="6" minChildWidth="350px" spacing="4">
      {images.map((image) => (
        <a href={image} key={image}>
          <Image src={image.replace("_o.jpg", "_z.jpg")} />
        </a>
      ))}
    </SimpleGrid>
  );
}
