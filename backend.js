const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Serve static files (frontend)
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ✅ Your POST /ask route
app.post('/ask', async (req, res) => {
  const { code } = req.body;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemma-3-12b"
    });

    const prompt = `
You are a helpful syntax fixer. Only fix syntax errors in the following code, don't change its logic.
Also list what changes were made (not in the code but separately).

Code:
\`\`\`
${code}
\`\`\`
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reply = response.text();

    res.json({ text: reply });
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

// ✅ Listen on proper port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});


