import fredRoutes from './routes/fredRoutes.ts';
import prisma from './prisma-connection.ts';
import express from 'express';
import { processLLMRequest } from './services/llmMcpService.ts';

const port = 3000;

const app = express();
app.use(express.json());
app.use('/api', fredRoutes);


app.post('/mcp/process', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await processLLMRequest(message);
    res.json({ response });
  } catch (error) {
    console.error('LLM processing error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

app.get('/db', async (req, res) => {
  try {
    const widgets = await prisma.widgets.findMany();
    res.status(200).send(widgets);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post('/db', async (req, res) => {
  const { title, type, filter } = req.body;

  try {
    await prisma.widgets.create({
      data: {
        title,
        type,
        filter,
      },
    });
    res.status(200).send({ message: 'added record' });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
app.put('/db', async (req, res) => {
  const { title, type, filter, id } = req.body;

  try {
    await prisma.widgets.update({
      where: { id: id },
      data: {
        title,
        type,
        filter,
      },
    });
    const widget = await prisma.widgets.findFirst({
      where: { id: id },
    });
    res.status(200).send(widget);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
app.delete('/db/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.widgets.delete({
      where: { id: id },
    });
    res.status(200).send({ message: 'deleted record' });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.listen(port, () => console.log(`Server started on port: ${port}`));