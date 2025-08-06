-- CreateEnum
CREATE TYPE "public"."PartnerTier" AS ENUM ('GOLD', 'SILVER', 'BRONZE', 'PARTNER');

-- CreateTable
CREATE TABLE "public"."topbar_settings" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "emailLabel" TEXT NOT NULL DEFAULT 'E-PASTS:',
    "location" TEXT NOT NULL,
    "locationLabel" TEXT NOT NULL DEFAULT 'NĀKAMĀ PIETURA:',
    "facebook" TEXT,
    "instagram" TEXT,
    "youtube" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "topbar_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."navbar_settings" (
    "id" SERIAL NOT NULL,
    "logoText" TEXT NOT NULL DEFAULT 'SDK',
    "logoSubtext" TEXT NOT NULL DEFAULT 'THUNDER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "navbar_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."navbar_menu_items" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "navbar_menu_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."hero_settings" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'SDKThunder',
    "subtitle" TEXT NOT NULL DEFAULT 'SPORTA DRAUGU KLUBS',
    "locationText" TEXT NOT NULL DEFAULT 'Nākamā pietura - Xiaomi Arēna, Rīga, Latvija.',
    "tagline1" TEXT NOT NULL DEFAULT 'Mēs Ticam !',
    "tagline2" TEXT NOT NULL DEFAULT 'Jūs Varat !',
    "buttonText" TEXT NOT NULL DEFAULT 'KALENDĀRS',
    "buttonLink" TEXT NOT NULL DEFAULT '/calendar',
    "countdownTitle" TEXT NOT NULL DEFAULT 'FIBA EuroBasket',
    "countdownSubtitle" TEXT NOT NULL DEFAULT '2025',
    "countdownDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "backgroundOverlay" TEXT DEFAULT '#7c2d12',
    "backgroundImage" TEXT,
    "logoImage" TEXT,
    "usePatternBg" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hero_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."events_settings" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Tuvākie sporta',
    "subtitle" TEXT NOT NULL DEFAULT 'pasākumi',
    "eventTitle" TEXT NOT NULL DEFAULT 'FIBA EuroBasket 2025',
    "eventSubtitle" TEXT DEFAULT '',
    "eventDescription" TEXT DEFAULT '',
    "eventLocation" TEXT DEFAULT 'Rīga, Latvija',
    "eventDates" TEXT DEFAULT '27/08 - 14/09',
    "eventYear" TEXT DEFAULT '2025',
    "eventType" TEXT DEFAULT 'Čempionāts',
    "eventTeams" TEXT DEFAULT '24 komandas',
    "buttonText" TEXT NOT NULL DEFAULT 'PILNS KALENDĀRS',
    "buttonLink" TEXT NOT NULL DEFAULT '/calendar',
    "logoImage" TEXT,
    "backgroundGradient" TEXT NOT NULL DEFAULT 'from-red-600 to-red-700',
    "showAdditionalText" BOOLEAN NOT NULL DEFAULT true,
    "additionalText" TEXT DEFAULT 'Vairāk sporta pasākumu un spēļu skatīties kalendārā',
    "additionalButtonText" TEXT DEFAULT 'Skatīt visus pasākumus',
    "additionalButtonLink" TEXT DEFAULT '/calendar',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."partners" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "logo" TEXT,
    "tier" "public"."PartnerTier" NOT NULL DEFAULT 'BRONZE',
    "website" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);
