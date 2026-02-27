import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const PORT = 3000;  
const DATA_FILE = path.join(process.cwd(), 'data', 'ticket.json');

app.use(cors());
app.use(express.json());

// Khởi tạo file data
async function initDataFile() {
    try {
        await fs.access(DATA_FILE);
    } catch {
        await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
        await fs.writeFile(DATA_FILE, JSON.stringify({}));
    }
}
initDataFile();

async function readData() {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
}

async function writeData(data: any) {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET /tickets - Lấy danh sách
app.get('/tickets', async (req, res) => {
    try {
        const data = await readData();
        let tickets = Object.values(data);
        
        // Lọc theo query params
        const { status, priority, tags } = req.query;
        
        if (status) {
            tickets = tickets.filter((t: any) => t.status === status);
        }
        if (priority) {
            tickets = tickets.filter((t: any) => t.priority === priority);
        }
        if (tags) {
            const tagList = (tags as string).split(',');
            tickets = tickets.filter((t: any) => 
                tagList.some(tag => t.tags?.includes(tag))
            );
        }
        
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /tickets/:id - Lấy 1 ticket
app.get('/tickets/:id', async (req, res) => {
    try {
        const data = await readData();
        const ticket = data[req.params.id];
        
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        
        res.json(ticket);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /tickets - Thêm ticket
app.post('/tickets', async (req, res) => {
    try {
        const data = await readData();
        const ticket = req.body;
        
        if (!ticket.id) {
            return res.status(400).json({ error: 'Ticket must have id' });
        }
        
        data[ticket.id] = ticket;
        await writeData(data);
        
        res.status(201).json(ticket);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /tickets/:id - Cập nhật
app.put('/tickets/:id', async (req, res) => {
    try {
        const data = await readData();
        const id = req.params.id;
        
        if (!data[id]) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        
        data[id] = { ...data[id], ...req.body };
        await writeData(data);
        
        res.json(data[id]);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE /tickets/:id - Xóa
app.delete('/tickets/:id', async (req, res) => {
    try {
        const data = await readData();
        const id = req.params.id;
        
        if (!data[id]) {
            return res.status(404).json({ error: 'Ticket not found' });
        }
        
        delete data[id];
        await writeData(data);
        
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Ticket Server đang chạy tại http://localhost:${PORT}`);
});