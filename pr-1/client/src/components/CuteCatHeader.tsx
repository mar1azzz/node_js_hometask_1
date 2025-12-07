// Header block with title, subtitle, and cute cat badge.

import { Group, Title} from "@mantine/core";

export default function CuteCatHeader() {
  return (
    <Group justify="space-between" mb="lg" align="center">
      <Group gap="sm">
        <img
          src="https://s3.getstickerpack.com/storage/uploads/sticker-pack/cat-memes/sticker_1.png"
          alt="Cat"
          width={48}
          height={48}
        />
        <div>
          <Title order={2} c="violetcat.6">
            Students Manager 🐾
          </Title>
        </div>
      </Group>

      <a
        href="http://localhost:3000/api-docs"
        target="_blank"
        rel="noopener noreferrer"
        className="cat-pill"
      >
        <img
          src="https://juststickers.in/wp-content/uploads/2020/06/meme-cat-326x326.png"
          alt="Cat"
        />
        <span>purr-fect API</span>
      </a>

    </Group>
  );
}
