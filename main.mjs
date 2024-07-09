import fs from "node:fs";
import express from "express";
import { PrismaClient } from "@prisma/client";
import escapeHTML from "escape-html";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("static"));
app.use(express.json());
const prisma = new PrismaClient();

const indexTemplate = fs.readFileSync("./templates/index.html", "utf-8");
const exerciseTemplate = fs.readFileSync("./templates/exercise.html", "utf-8");
const learnedTemplate = fs.readFileSync("./templates/learned.html", "utf-8");

app.get("/", async (request, response) => {
  try {
    const cards = await prisma.card.findMany();
    const html = indexTemplate.replace(
      "<!-- cards -->",
      cards
        .map(
          (card) => `
            <tr>
              <td>${escapeHTML(card.question)}</td>
              <td>${escapeHTML(card.answer)}</td>
              <td>
                <form action="/delete" method="post">
                  <input type="hidden" name="id" value="${card.id}" />
                  <button type="submit">削除</button>
                </form>
              </td>
            </tr>
          `
        )
        .join("")
    );
    response.send(html);
  } catch (error) {
    console.error(error);
    response.status(500).send("サーバーエラーが発生しました。");
  }
});

app.get("/exercise", async (request, response) => {
  try {
    const index = parseInt(request.query.index) || 0;
    const card = await prisma.card.findFirst({
      where: { id: { gte: index }, learned: false },
      orderBy: { id: "asc" },
    });

    if (!card) {
      response.status(404).send("カードが見つかりませんでした。");
      return;
    }

    const previousCard = await prisma.card.findFirst({
      where: { id: { lt: card.id }, learned: false },
      orderBy: { id: "desc" },
    });

    const nextCard = await prisma.card.findFirst({
      where: { id: { gt: card.id }, learned: false },
      orderBy: { id: "asc" },
    });

    let controlsHtml = "";
    if (previousCard !== null) {
      controlsHtml += `<a href="/exercise?index=${previousCard.id}">前へ</a>`;
    }
    if (nextCard !== null) {
      controlsHtml += `<a href="/exercise?index=${nextCard.id}">次へ</a>`;
    }

    const html = exerciseTemplate
      .replace("<!-- question -->", escapeHTML(card.question))
      .replace("<!-- answer -->", escapeHTML(card.answer))
      .replace("<!-- controls -->", controlsHtml);

    response.send(html);
  } catch (error) {
    console.error(error);
    response.status(500).send("サーバーエラーが発生しました。");
  }
});

app.get("/learned", async (request, response) => {
  try {
    const learnedCards = await prisma.card.findMany({
      where: { learned: true },
    });
    const html = learnedTemplate.replace(
      "<!-- learned-cards -->",
      learnedCards
        .map(
          (card) => `
            <tr>
              <td>${escapeHTML(card.question)}</td>
              <td>${escapeHTML(card.answer)}</td>
              <td>
                <button class="restore-button" data-id="${card.id}">テストに復活</button>
              </td>
            </tr>
          `
        )
        .join("")
    );
    response.send(html);
  } catch (error) {
    console.error(error);
    response.status(500).send("サーバーエラーが発生しました。");
  }
});

app.post("/create", async (request, response) => {
  const { question, answer } = request.body;
  if (!question || !answer) {
    response.status(400).send("質問と答えの両方を入力してください。");
    return;
  }
  try {
    await prisma.card.create({
      data: { question, answer },
    });
    response.redirect("/");
  } catch (error) {
    console.error(error);
    response.status(500).send("サーバーエラーが発生しました。");
  }
});

app.post("/delete", async (request, response) => {
  try {
    const id = parseInt(request.body.id);
    await prisma.card.delete({ where: { id } });
    response.redirect("/");
  } catch (error) {
    console.error(error);
    response.status(500).send("サーバーエラーが発生しました。");
  }
});

app.post("/learned", async (request, response) => {
  const { question, learned } = request.body;
  try {
    await prisma.card.updateMany({
      where: { question },
      data: { learned: Boolean(learned) },
    });
    response.status(200).send("Updated");
  } catch (error) {
    console.error(error);
    response.status(500).send("サーバーエラーが発生しました。");
  }
});

app.post("/restore", async (request, response) => {
  const { id } = request.body;
  try {
    await prisma.card.update({
      where: { id: parseInt(id) },
      data: { learned: false },
    });
    response.status(200).send("Restored");
  } catch (error) {
    console.error(error);
    response.status(500).send("サーバーエラーが発生しました。");
  }
});

app.listen(3000, () => {
  console.log("サーバーがポート3000で起動しました。");
});
