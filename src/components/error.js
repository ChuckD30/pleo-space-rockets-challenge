import React from "react";
import {
  Flex,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/core";

export default function Error() {
  return (
    <Flex alignItems="center" justifyContent="center" width="100%">
      <Alert
        status="error"
        variant="left-accent"
        flexDirection="column"
        justifyContent="center"
        textAlign="center"
        p="8"
      >
        <AlertIcon size="6" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Problems loading the data
        </AlertTitle>
        <AlertDescription maxWidth="md">
          If the problem persists, try to refresh the page or wait a few minutes
          and try again.
        </AlertDescription>
      </Alert>
    </Flex>
  );
}
