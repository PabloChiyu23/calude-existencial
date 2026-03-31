import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // Solo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  // Validación básica
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  if (!email.includes('@')) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  if (message.length > 2000) {
    return res.status(400).json({ error: 'Mensaje demasiado largo' });
  }

  const { error } = await supabase
    .from('contacts')
    .insert([{ name, email, message }]);

  if (error) {
    console.error('Supabase error:', error);
    return res.status(500).json({ error: 'Error al guardar el mensaje' });
  }

  return res.status(200).json({ ok: true });
}
