export default async function (req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({error: 'Only POST allowed'});
    return;
  }

  const {message} = req.body;
  if (!message) {
    res.status(400).json({error: 'No message'});
    return;
  }

  try {
    const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-70b-instruct:free",
        messages: [
          {role: "system", content: "You are a helpful AI assistant."},
          {role: "user", content: message}
        ]
      })
    });

    if (!r.ok) throw new Error('API failed');
    
    const data = await r.json();
    const reply = data.choices?.[0]?.message?.content || 'No response';
    
    res.json({reply});
  } catch (e) {
    console.error(e);
    res.status(500).json({error: 'AI service error'});
  }
}
