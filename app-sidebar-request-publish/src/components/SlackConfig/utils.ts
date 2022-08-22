import axios from "axios";
import qs from "qs";
import { SLACK_LIST_CHANNELS_URI } from "../../constants/slack";

export type ConversationChannelType = {
  id: string;
  name: string;
};

export const listChannels = async (
  token: string
): Promise<ConversationChannelType[]> => {
  if (token) {
    const options = {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: qs.stringify({ token, limit: "1000" }),
      url: SLACK_LIST_CHANNELS_URI,
    };
    const response = await axios(options);

    const channels: Array<ConversationChannelType> =
      response.data?.channels ?? [];

    const sortedChannels = channels.sort((a, b) => {
      if (a.name.toLowerCase().charAt(0) > b.name.toLowerCase().charAt(0)) {
        return 1;
      }
      if (a.name.toLowerCase().charAt(0) < b.name.toLowerCase().charAt(0)) {
        return -1;
      }
      return 0;
    });

    return sortedChannels;
  }

  return [];
};
