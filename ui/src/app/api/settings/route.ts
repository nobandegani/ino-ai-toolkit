import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { defaultTrainFolder, defaultDatasetsFolder } from '@/paths';
import { flushCache } from '@/server/settings';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const settings = await prisma.settings.findMany();
    const settingsObject = settings.reduce((acc: any, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
    // if TRAINING_FOLDER is not set, use default
    if (!settingsObject.TRAINING_FOLDER || settingsObject.TRAINING_FOLDER === '') {
      settingsObject.TRAINING_FOLDER = defaultTrainFolder;
    }
    // if DATASETS_FOLDER is not set, use default
    if (!settingsObject.DATASETS_FOLDER || settingsObject.DATASETS_FOLDER === '') {
      settingsObject.DATASETS_FOLDER = defaultDatasetsFolder;
    }
    return NextResponse.json(settingsObject);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      HF_TOKEN,
      TRAINING_FOLDER,
      DATASETS_FOLDER,
      S3_ENDPOINT_URL,
      S3_REGION_NAME,
      S3_BUCKET_NAME,
      S3_ACCESS_KEY,
      S3_ACCESS_SECRET,
      S3_ROOT_PATH,
    } = body;

    // Upsert all settings
    await Promise.all([
      prisma.settings.upsert({
        where: { key: 'HF_TOKEN' },
        update: { value: HF_TOKEN },
        create: { key: 'HF_TOKEN', value: HF_TOKEN },
      }),
      prisma.settings.upsert({
        where: { key: 'TRAINING_FOLDER' },
        update: { value: TRAINING_FOLDER },
        create: { key: 'TRAINING_FOLDER', value: TRAINING_FOLDER },
      }),
      prisma.settings.upsert({
        where: { key: 'DATASETS_FOLDER' },
        update: { value: DATASETS_FOLDER },
        create: { key: 'DATASETS_FOLDER', value: DATASETS_FOLDER },
      }),
      prisma.settings.upsert({
        where: { key: 'S3_ENDPOINT_URL' },
        update: { value: S3_ENDPOINT_URL },
        create: { key: 'S3_ENDPOINT_URL', value: S3_ENDPOINT_URL },
      }),
      prisma.settings.upsert({
        where: { key: 'S3_REGION_NAME' },
        update: { value: S3_REGION_NAME },
        create: { key: 'S3_REGION_NAME', value: S3_REGION_NAME },
      }),
      prisma.settings.upsert({
        where: { key: 'S3_BUCKET_NAME' },
        update: { value: S3_BUCKET_NAME },
        create: { key: 'S3_BUCKET_NAME', value: S3_BUCKET_NAME },
      }),
      prisma.settings.upsert({
        where: { key: 'S3_ACCESS_KEY' },
        update: { value: S3_ACCESS_KEY },
        create: { key: 'S3_ACCESS_KEY', value: S3_ACCESS_KEY },
      }),
      prisma.settings.upsert({
        where: { key: 'S3_ACCESS_SECRET' },
        update: { value: S3_ACCESS_SECRET },
        create: { key: 'S3_ACCESS_SECRET', value: S3_ACCESS_SECRET },
      }),
      prisma.settings.upsert({
        where: { key: 'S3_ROOT_PATH' },
        update: { value: S3_ROOT_PATH },
        create: { key: 'S3_ROOT_PATH', value: S3_ROOT_PATH },
      }),
    ]);

    flushCache();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
