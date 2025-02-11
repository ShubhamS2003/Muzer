-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "genre" TEXT NOT NULL DEFAULT 'Bollywood',
    "live" BOOLEAN NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
