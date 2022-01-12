import React, { useEffect, useState } from "react";
import { Badge, Box, Image, SimpleGrid, Text, Flex } from "@chakra-ui/core";
import { format as timeAgo } from "timeago.js";
import { Link } from "react-router-dom";
import { Star } from "react-feather";

import { useSpaceXPaginated } from "../utils/use-space-x";
import { formatDate } from "../utils/format-date";
import Error from "./error";
import Breadcrumbs from "./breadcrumbs";
import LoadMoreButton from "./load-more-button";
import { LaunchFavourites } from "./favourites-drawer";
import useData from "./hooks/useData";

const PAGE_SIZE = 12;

export default function Launches() {
  const {
    size,
    error,
    setSize,
    isValidating,
    data: launchData,
  } = useSpaceXPaginated("/launches/past", {
    limit: PAGE_SIZE,
    order: "desc",
    sort: "launch_date_utc",
  });

  const {
    data: {
      favourites,
      favourites: { launches },
    },
    dispatch,
  } = useData();

  const [data, setData] = useState(launchData?.flat() || []);

  const [favouritesList, setFavouritesList] = useState([]);

  const [showFavourites, setShowFavourites] = useState(false);

  const toggleDrawer = () => {
    setShowFavourites(!showFavourites);
  };

  useEffect(() => {
    setData(launchData?.flat() || []);
  }, [launchData]);

  useEffect(() => {
    if (data && data.length) {
      setFavouritesList([
        ...data.filter((launch) => launches.includes(launch.flight_number)),
      ]);
    }
  }, [launches, data]);

  const addToFavourites = (launch) => {
    if (!launches.includes(launch.flight_number)) {
      dispatch({
        favourites: {
          ...favourites,
          launches: [...launches, launch.flight_number],
        },
      });
    } else {
      dispatch({
        favourites: {
          ...favourites,
          launches: launches.filter(
            (launchItem) => launchItem !== launch.flight_number
          ),
        },
      });
    }
  };

  return (
    <div>
      <LaunchFavourites
        active={showFavourites}
        close={setShowFavourites}
        list={favouritesList}
      />
      <Flex align={"center"} justify={"space-between"} mr={6}>
        <Breadcrumbs
          items={[{ label: "Home", to: "/" }, { label: "Launches" }]}
        />
        <Text cursor="pointer" onClick={toggleDrawer}>
          Favourites
        </Text>
      </Flex>
      <SimpleGrid m={[2, null, 6]} minChildWidth="350px" spacing="4">
        {error && <Error />}
        {data &&
          data.map((launch) => (
            <LaunchItem
              launch={launch}
              addToFavourites={addToFavourites}
              key={launch.flight_number}
            />
          ))}
      </SimpleGrid>
      <LoadMoreButton
        loadMore={() => setSize(size + 1)}
        data={data}
        pageSize={PAGE_SIZE}
        isLoadingMore={isValidating}
      />
    </div>
  );
}

export function LaunchItem({ launch, addToFavourites }) {
  const {
    data: {
      favourites: { launches },
    },
  } = useData();

  return (
    <Box
      as={Link}
      to={`/launches/${launch.flight_number.toString()}`}
      boxShadow="md"
      borderWidth="1px"
      rounded="lg"
      overflow="hidden"
      position="relative"
    >
      <Image
        src={
          launch.links.flickr_images[0]?.replace("_o.jpg", "_z.jpg") ??
          launch.links.mission_patch_small
        }
        alt={`${launch.mission_name} launch`}
        height={["200px", null, "300px"]}
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
            {launch.rocket.rocket_name} &bull; {launch.launch_site.site_name}
          </Box>
        </Box>

        <Flex align={"center"}>
          <Box
            mt="1"
            fontWeight="semibold"
            as="h4"
            lineHeight="tight"
            isTruncated
          >
            {launch.mission_name}
          </Box>
          <Box
            ml="2"
            mt="1"
            as={Star}
            size="16px"
            color="gray.500"
            onClick={(event) => {
              event.preventDefault();
              addToFavourites(launch);
            }}
            fill={launches.includes(launch.flight_number) ? "gold" : ""}
          />
        </Flex>
        <Flex>
          <Text fontSize="sm">{formatDate(launch.launch_date_utc)} </Text>
          <Text color="gray.500" ml="2" fontSize="sm">
            {timeAgo(launch.launch_date_utc)}
          </Text>
        </Flex>
      </Box>
    </Box>
  );
}
