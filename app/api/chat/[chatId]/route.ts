import { NextResponse } from "next/server";
import { getChat, sendMessage, deleteChat } from "@/app/utils/chatMap";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ chatId: string }> }
) {
  const { chatId } = await params;
  const messages = getChat(chatId);
  return NextResponse.json(messages);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ chatId: string }> }
) {
  const { chatId } = await params;
  const { user, text } = await req.json();

  if (!user || !text) {
    return NextResponse.json(
      { error: "Missing user or text" },
      { status: 400 }
    );
  }

  const msg = sendMessage(chatId, user, text);
  return NextResponse.json(msg, { status: 201 });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ chatId: string }> }
) {
  const { chatId } = await params;
  deleteChat(chatId);
  return NextResponse.json({ message: "Chat deleted" });
}
