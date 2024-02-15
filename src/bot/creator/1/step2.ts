import path from "path";
import { userState } from "@/vars/userState";
import { HearsContext, Context, InputFile } from "grammy";
import { editHtmlFileText } from "@/utils/template";
import { errorHandler } from "@/utils/handlers";
import { prevMessage } from "@/vars/prevMessage";

export async function template1Step2(ctx: HearsContext<Context>) {
  try {
    const from = ctx.from;
    const message = ctx.message;
    const descriptionText = message?.text || "";

    if (!from || !message) return ctx.reply("Please do /start again");
    const confirmation = await ctx.reply("Adding...");

    const filePath = path.join(
      process.cwd(),
      "temp",
      `${from.id}-1`,
      "index.html"
    );

    await editHtmlFileText(filePath, "p.lead", descriptionText);

    const storedPrevMessage = prevMessage[from.id];
    const photo = new InputFile("./step-images/1/3.png");
    const caption = `"${descriptionText}" set as description for the first section.\n\nNext up, send the image you want to be shown in the first section.\n\nStep 3 of 14`;
    const reply = await ctx.replyWithPhoto(photo, { caption });

    userState[from.id] = "1-3";
    prevMessage[from.id] = reply.message_id;
    ctx.deleteMessage();
    ctx.deleteMessages([storedPrevMessage, confirmation.message_id]);
  } catch (error) {
    errorHandler(error);
    ctx.reply("Please do /start again");
  }
}