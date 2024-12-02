<script setup lang="ts">
import confetti from 'canvas-confetti'
import { inBrowser } from 'vitepress'

if (inBrowser) {
  const colors = ['#F6F6F7', '#EC4619'];
  confetti({
    particleCount: 500,
    spread: 170,
    origin: { y: 0.6 },
    colors: colors
  })
  confetti({
    particleCount: 500,
    angle: 60,
    spread: 600,
    origin: { x: 0, y: 0 },
    colors: colors
  });
  confetti({
    particleCount: 500,
    angle: 120,
    spread: 600,
    origin: { x: 1, y: 0 },
    colors: colors
  });
}
</script>
