-- CreateTable
CREATE TABLE "Card" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "learned" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);
