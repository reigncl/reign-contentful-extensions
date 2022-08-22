import axios from "axios";
import qs from "qs";
import { SLACK_POST_MESSAGE_URI } from "../../constants/slack";

export const postSlackMessage = async (
  token: string,
  channel: string,
  text: string
): Promise<boolean> => {
  if (token) {
    const options = {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: qs.stringify({ token, channel, text }),
      url: SLACK_POST_MESSAGE_URI,
    };
    const response = await axios(options);

    const isOk: boolean = response.data?.ok ?? false;
    return isOk;
  }
  return false;
};
