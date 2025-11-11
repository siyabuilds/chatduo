import { NextResponse } from "next/server";
import { getChat, sendMessage, deleteChat } from "@/app/utils/chatMap";

export async function GET(
  _req: Request,
  { params }: { params: { chatId: string } }
) {
  const messages = getChat(params.chatId);
  return NextResponse.json(messages);
}

export async function POST(
  req: Request,
  { params }: { params: { chatId: string } }
) {
  const { user, text } = await req.json();

  if (!user || !text) {
    return NextResponse.json(
      { error: "Missing user or text" },
      { status: 400 }
    );
  }

  const msg = sendMessage(params.chatId, user, text);
  return NextResponse.json(msg, { status: 201 });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { chatId: string } }
) {
  deleteChat(params.chatId);
  return NextResponse.json({ message: "Chat deleted" });
}
