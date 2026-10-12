const User = require('./models/User');
const Post = require('./models/Post');
const { uniqueSlug } = require('./utils/slugify');

const SAMPLE_POSTS = [
  {
    title: 'Building Calm Interfaces in a Noisy Web',
    excerpt: 'How typography, spacing, and restraint make reading feel effortless.',
    category: 'Design',
    tags: ['ui', 'typography', 'craft'],
    content: `<p>Most sites shout. The ones people return to whisper — they give the eye a place to rest and the mind a path to follow.</p>
<p>Start with a type scale that only changes when the meaning changes. Pair a high-contrast heading with a body size you can actually read. Then let whitespace do the work that extra boxes and gradients never will.</p>
<p>A calm interface is not empty. It is edited.</p>`,
  },
  {
    title: 'A Weekend in the Hill Stations',
    excerpt: 'Mist, tea, and the small rituals that make travel feel local.',
    category: 'Travel',
    tags: ['india', 'weekend', 'trails'],
    content: `<p>Leave before dawn. The highway empties, the radio fades, and by the time the first tea stall appears the air has already changed.</p>
<p>Walk the ridge path in the afternoon, not for a view you can photograph, but for the one you cannot: wet pine, distant horns, a dog that knows every shopkeeper by name.</p>
<p>Travel is rarely the landmark. It is the hour you were not in a hurry.</p>`,
  },
  {
    title: 'Notes on Learning the MERN Stack',
    excerpt: 'MongoDB, Express, React, and Node — a practical map for a first product.',
    category: 'Technology',
    tags: ['mern', 'javascript', 'mongodb'],
    content: `<p>The MERN stack is four tools that share one language. That is the whole pitch, and it still holds.</p>
<p>Model your data first. A blog is posts, users, and comments — not a pile of pages. Once the collections are honest, Express routes become boring in the best way, and React has something real to render.</p>
<p>Ship a login, a list, and a form. Everything else is craft layered on a working loop.</p>`,
  },
  {
    title: 'Kitchen Staples That Carry a Week',
    excerpt: 'Five ingredients, many dinners, and no last-minute grocery panic.',
    category: 'Food',
    tags: ['cooking', 'weeknight', 'pantry'],
    content: `<p>Keep onions, eggs, a pot of grains, a hard cheese, and something pickled. Dinner then becomes assembly, not invention.</p>
<p>A fried egg on leftover rice with chili oil is not a recipe. It is a habit that saves Tuesday.</p>`,
  },
];

async function seedAdminAndPosts() {
  const email = (process.env.ADMIN_EMAIL || 'admin@blog.com').toLowerCase();
  let admin = await User.findOne({ email });
  if (!admin) {
    admin = await User.create({
      name: process.env.ADMIN_NAME || 'Site Admin',
      email,
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'admin',
    });
    console.log(`Seeded admin: ${email}`);
  } else if (admin.role !== 'admin') {
    admin.role = 'admin';
    await admin.save();
  }

  const count = await Post.countDocuments();
  if (count === 0) {
    for (const sample of SAMPLE_POSTS) {
      const slug = await uniqueSlug(Post, sample.title);
      await Post.create({ ...sample, slug, author: admin._id, published: true });
    }
    console.log('Seeded sample posts');
  }
}

module.exports = seedAdminAndPosts;

if (require.main === module) {
  require('dotenv').config();
  const connectDB = require('./config/db');
  connectDB()
    .then(() => seedAdminAndPosts())
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
