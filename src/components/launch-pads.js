import React, { useCallback, useEffect, useState } from "react";
import { Badge, Box, SimpleGrid, Flex, Text, Select } from "@chakra-ui/core";
import { Link } from "react-router-dom";
import { Star } from "react-feather";

import Error from "./error";
import useData from "./hooks/useData";
import Breadcrumbs from "./breadcrumbs";
import LoadMoreButton from "./load-more-button";
import { LaunchPadFavourites } from "./favourites-drawer";
import { useSpaceXPaginated } from "../utils/use-space-x";

const PAGE_SIZE = 12;

export default function LaunchPads() {
  const {
    data: launchPadData,
    error,
    isValidating,
    size,
    setSize,
  } = useSpaceXPaginated("/launchpads", {
    limit: PAGE_SIZE,
  });

  const {
    data: {
      favourites,
      favourites: { launchPads },
    },
    dispatch,
  } = useData();

  const [filter, setFilter] = useState("all");

  const [data, setData] = useState(launchPadData?.flat() || []);

  const [favouritesList, setFavouritesList] = useState([]);

  const [showFavourites, setShowFavourites] = useState(false);

  const toggleDrawer = () => {
    setShowFavourites(!showFavourites);
  };

  const filterLaunchPads = useCallback(() => {
    if (filter === "all") {
      setData(launchPadData?.flat() || []);
    } else if (filter === "active") {
      setData(
        launchPadData
          .flat()
          .filter((launchPad) => launchPad.status === "active")
      );
    } else {
      setData(launchPadData.flat().filter((launchPad) => launchPad.status !== "active"));
    }
  }, [filter, launchPadData]);

  useEffect(() => {
    if (launchPadData && launchPadData.length) {
      filterLaunchPads()
    }
  }, [filter, launchPadData, filterLaunchPads]);

  useEffect(() => {
    if (launchPadData && launchPadData.length) {
      setFavouritesList([
        ...launchPadData
          .flat()
          .filter((launchPad) => launchPads.includes(launchPad.site_id)),
      ]);
    }
  }, [launchPads, launchPadData]);

  const addToFavourites = (launchPad) => {
    if (!launchPads.includes(launchPad.site_id)) {
      dispatch({
        favourites: {
          ...favourites,
          launchPads: [...launchPads, launchPad.site_id],
        },
      });
    } else {
      dispatch({
        favourites: {
          ...favourites,
          launchPads: launchPads.filter(
            (launchPadItem) => launchPadItem !== launchPad.site_id
          ),
        },
      });
    }
  };

  return (
    <div>
      <LaunchPadFavourites
        active={showFavourites}
        close={setShowFavourites}
        list={favouritesList}
      />
      <Flex align={"center"} justify={"space-between"} mr={6}>
        <Breadcrumbs
          items={[{ label: "Home", to: "/" }, { label: "Launch Pads" }]}
        />
        <Text cursor="pointer" onClick={toggleDrawer}>
          Favourites
        </Text>
      </Flex>
      <Flex m={(2, 6)} align="center">
        <Text mr={2}>Filter </Text>
        <Select
          size="sm"
          maxWidth={"300px"}
          color="gray.700"
          bg="white"
          onChange={(e) => {
            setFilter(e.target.value);
          }}
        >
          <option value="all" onClick={() => setFilter("all")}>
            All launch pads
          </option>
          <option value="retired" onClick={() => setFilter("retired")}>
            Retired Launch pads only
          </option>
          <option value="active" onClick={() => setFilter("active")}>
            Active Launch pads only
          </option>
        </Select>
      </Flex>
      <SimpleGrid m={[2, null, 6]} minChildWidth="350px" spacing="4">
        {error && <Error />}
        {data &&
          data.map((launchPad) => (
            <LaunchPadItem
              launchPad={launchPad}
              key={launchPad.site_id}
              addToFavourites={addToFavourites}
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

function LaunchPadItem({ launchPad, addToFavourites }) {
  const {
    data: {
      favourites: { launchPads },
    },
  } = useData();

  return (
    <Box
      as={Link}
      to={`/launch-pads/${launchPad.site_id}`}
      boxShadow="md"
      borderWidth="1px"
      rounded="lg"
      overflow="hidden"
      position="relative"
    >
      <Box p="6">
        <Box d="flex" alignItems="baseline">
          {launchPad.status === "active" ? (
            <Badge px="2" variant="solid" variantColor="green">
              Active
            </Badge>
          ) : (
            <Badge px="2" variant="solid" variantColor="red">
              Retired
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
            {launchPad.attempted_launches} attempted &bull;{" "}
            {launchPad.successful_launches} succeeded
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
            {launchPad.name}
          </Box>
          <Box
            ml="2"
            mt="1"
            as={Star}
            size="16px"
            color="gray.500"
            onClick={(event) => {
              event.preventDefault();
              addToFavourites(launchPad);
            }}
            fill={launchPads.includes(launchPad.site_id) ? "gold" : ""}
          />
        </Flex>
        <Text color="gray.500" fontSize="sm">
          {launchPad.vehicles_launched.join(", ")}
        </Text>
      </Box>
    </Box>
  );
}
