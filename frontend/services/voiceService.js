import { COMMANDS } from "../voice/commands";

export const processVoiceCommand = (
  text,
  navigate
) => {

  const command =
    text.toLowerCase();

  if (
    command.includes(
      "open dashboard"
    )
  ) {

    navigate(
      "/dashboard"
    );

    return;
  }

  if (
    command.includes(
      "open friends"
    )
  ) {

    navigate(
      "/friends"
    );

    return;
  }

  if (
    command.includes(
      "open groups"
    )
  ) {

    navigate(
      "/groups"
    );

    return;
  }

  if (
    command.includes(
      "open admin"
    )
  ) {

    navigate(
      "/admin"
    );

    return;
  }

  if (
    command.includes(
      "logout"
    )
  ) {

    localStorage.clear();

    navigate("/");

    return;
  }

  console.log(
    "Unknown Command:",
    command
  );

};

