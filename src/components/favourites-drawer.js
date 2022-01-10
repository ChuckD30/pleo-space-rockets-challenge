import React from "react";
import {
  Text,
  Box,
  Link,
  Badge,
  Image,
  Heading,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/core";
import { Trash } from "react-feather";

import useData from "./hooks/useData";

export function LaunchFavourites({ active, close, list }) {
  const {
    data: {
      favourites: { launches },
    },
    dispatch,
  } = useData();

  const removeItem = (launch) => {
    dispatch({
      favourites: {
        launches: launches.filter(
          (launchItem) => launchItem !== launch.flight_number
        ),
      },
    });
  };

  return (
    active && (
      <div>
        <Drawer isOpen={active} placement="right" onClose={() => close(false)}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Favourites</DrawerHeader>
            <DrawerBody style={{ overflowY: "scroll" }}>
              <Heading>Launches ({list.length})</Heading>
              {list.length > 0 ? (
                list.map((launch) => (
                  <div>
                    <Box
                      as={Link}
                      to={`/launches/${launch.flight_number.toString()}`}
                      boxShadow="md"
                      rounded="lg"
                      m={[3, 6]}
                      overflow="hidden"
                      position="relative"
                    >
                      <Box
                        ml="2"
                        mt="1"
                        as={Trash}
                        size="20px"
                        color="red.500"
                        onClick={(event) => {
                          event.preventDefault();
                          removeItem(launch);
                        }}
                      />
                      <Image
                        src={
                          launch.links.flickr_images[0]?.replace(
                            "_o.jpg",
                            "_z.jpg"
                          ) ?? launch.links.mission_patch_small
                        }
                        alt={`${launch.mission_name} launch`}
                        height={["100px", null, "100px"]}
                        width="100%"
                        objectFit="cover"
                        objectPosition="bottom"
                      />

                      <Image
                        position="absolute"
                        top="5"
                        right="5"
                        src={launch.links.mission_patch_small}
                        height="75px"
                        objectFit="contain"
                        objectPosition="bottom"
                      />

                      <Box p="6">
                        <Box d="flex" alignItems="baseline">
                          {launch.launch_success ? (
                            <Badge px="2" variant="solid" variantColor="green">
                              Successful
                            </Badge>
                          ) : (
                            <Badge px="2" variant="solid" variantColor="red">
                              Failed
                            </Badge>
                          )}
                          <Box
                            color="gray.500"
                            fontWeight="semibold"
                            letterSpacing="wide"
                            fontSize="xs"
                            textTransform="uppercase"
                            ml="2"
                          >
                            {launch.rocket.rocket_name} &bull;{" "}
                            {launch.launch_site.site_name}
                          </Box>
                        </Box>
                      </Box>
                    </Box>{" "}
                  </div>
                  // <LaunchItem launch={launch} key={launch.flight_number} />
                ))
              ) : (
                <Text>No favourites yet</Text>
              )}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </div>
    )
  );
}

export function LaunchPadFavourites({ active, close, list }) {
  // const {
  //   data: {
  //     favourites: { launchPads },
  //   },
  //   dispatch,
  // } = useData();

  // const removeItem = (launchPad) => {
  //   dispatch({
  //     favourites: {
  //       launchPads: launchPads.filter(
  //         (launchItem) => launchItem !== launch.flight_number
  //       ),
  //     },
  //   });
  // };

  return (
    active && (
      <div>
        <Drawer isOpen={active} placement="right" onClose={() => close(false)}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Favourites</DrawerHeader>
            <DrawerBody style={{ overflowY: "scroll" }}>
              <Heading>Launch Pads ({list.length})</Heading>
              {list.length > 0 ? (
                list.map((launch) => (
                  <div>
                    <Box
                      as={Link}
                      to={`/launches/${launch.flight_number.toString()}`}
                      boxShadow="md"
                      rounded="lg"
                      m={[3, 6]}
                      overflow="hidden"
                      position="relative"
                    >
                      {/* <Box
                        ml="2"
                        mt="1"
                        as={Trash}
                        size="20px"
                        color="red.500"
                        onClick={(event) => {
                          event.preventDefault();
                          removeItem(launch);
                        }}
                      /> */}
                      <Image
                        src={
                          launch.links.flickr_images[0]?.replace(
                            "_o.jpg",
                            "_z.jpg"
                          ) ?? launch.links.mission_patch_small
                        }
                        alt={`${launch.mission_name} launch`}
                        height={["100px", null, "100px"]}
                        width="100%"
                        objectFit="cover"
                        objectPosition="bottom"
                      />

                      <Image
                        position="absolute"
                        top="5"
                        right="5"
                        src={launch.links.mission_patch_small}
                        height="75px"
                        objectFit="contain"
                        objectPosition="bottom"
                      />

                      <Box p="6">
                        <Box d="flex" alignItems="baseline">
                          {launch.launch_success ? (
                            <Badge px="2" variant="solid" variantColor="green">
                              Successful
                            </Badge>
                          ) : (
                            <Badge px="2" variant="solid" variantColor="red">
                              Failed
                            </Badge>
                          )}
                          <Box
                            color="gray.500"
                            fontWeight="semibold"
                            letterSpacing="wide"
                            fontSize="xs"
                            textTransform="uppercase"
                            ml="2"
                          >
                            {launch.rocket.rocket_name} &bull;{" "}
                            {launch.launch_site.site_name}
                          </Box>
                        </Box>
                      </Box>
                    </Box>{" "}
                  </div>
                  // <LaunchItem launch={launch} key={launch.flight_number} />
                ))
              ) : (
                <Text>No favourites yet</Text>
              )}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </div>
    )
  );
}
