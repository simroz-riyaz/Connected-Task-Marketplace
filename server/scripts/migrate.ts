import pool from '../db';

const migrate = async () => {
    try {
        console.log('Starting migration...');

        // Check/Add tasker_id to Tasks
        try {
            await pool.query('SELECT tasker_id FROM Tasks LIMIT 1');
            console.log('tasker_id already exists in Tasks');
        } catch (err) {
            console.log('Adding tasker_id to Tasks table...');
            await pool.query('ALTER TABLE Tasks ADD COLUMN tasker_id INT');
            await pool.query('ALTER TABLE Tasks ADD CONSTRAINT fk_task_tasker FOREIGN KEY (tasker_id) REFERENCES Users(id) ON DELETE SET NULL');
            console.log('tasker_id added successfully');
        }

        // Check/Add file_url to Chats
        try {
            await pool.query('SELECT file_url FROM Chats LIMIT 1');
            console.log('file_url already exists in Chats');
        } catch (err) {
            console.log('Adding file_url to Chats table...');
            await pool.query('ALTER TABLE Chats ADD COLUMN file_url VARCHAR(255)');
            console.log('file_url added successfully');
        }

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrate();
