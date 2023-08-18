import React from "react";
import {
  Card as CustomCard,
  Button,
  CardBody,
  CardSubtitle,
  CardText,
  CardTitle,
} from "reactstrap";

export const Card = () => {
  return (
    <CustomCard
      color="light"
      style={{
        width: "18rem",
      }}
    >
      <img alt="Sample" src="https://picsum.photos/300/200" />
      <CardBody>
        <CardTitle>Card Title</CardTitle>
        <CardSubtitle className="mb-2 text-muted" tag="h6">
          Card Subtitle
        </CardSubtitle>
        <CardText>
          Some quick example text to build on the card title and make up the
          bulk of the card‘s content.
        </CardText>
        <Button>Button</Button>
      </CardBody>
    </CustomCard>
  );
};
