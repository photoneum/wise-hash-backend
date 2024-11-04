-- CreateTable
CREATE TABLE "SupplyChainEvent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eventId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "originLocation" TEXT NOT NULL,
    "destinationLocation" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productType" TEXT NOT NULL,
    "weight" REAL NOT NULL,
    "otherProductData" TEXT,
    "numberOfExchanges" INTEGER NOT NULL,
    "expectedDeliveryDate" DATETIME NOT NULL,
    "insuranceProvider" TEXT NOT NULL,
    "coverageType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "ownerId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SupplyChainEvent_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ParticipantInEvent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "contactInformation" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "eventId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ParticipantInEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "SupplyChainEvent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "SupplyChainEvent_eventId_key" ON "SupplyChainEvent"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "ParticipantInEvent_eventId_role_key" ON "ParticipantInEvent"("eventId", "role");
