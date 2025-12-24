const pool = require("../utils/db");

// LIST PROJECTS
exports.listProjects = async (req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM projects WHERE is_active=true"
  );
  res.render("projects/index", { projects: rows });
};

// PROJECT DETAILS
exports.projectDetails = async (req, res) => {
  const projectId = req.params.id;

  const project = await pool.query("SELECT * FROM projects WHERE id=$1", [
    projectId,
  ]);

  const images = await pool.query(
    "SELECT * FROM project_images WHERE project_id=$1",
    [projectId]
  );

  const videos = await pool.query(
    "SELECT * FROM project_videos WHERE project_id=$1",
    [projectId]
  );

  res.render("projects/details", {
    project: project.rows[0],
    images: images.rows,
    videos: videos.rows,
  });
};

// BOOK PROJECT
exports.bookProject = async (req, res) => {
  const { description, expected_budget, timeline } = req.body;
  const projectId = req.params.id;

  await pool.query(
    `INSERT INTO project_bookings
     (project_id, user_id, description, expected_budget, timeline)
     VALUES ($1,$2,$3,$4,$5)`,
    [projectId, req.session.user.id, description, expected_budget, timeline]
  );

  res.redirect("/dashboard/projects");
};

// LIST BOOKED PROJECTS FOR DASHBOARD
exports.userProjects = async (req, res) => {
  const userId = req.session.user.id;

  const { rows } = await pool.query(
    `SELECT pb.*, p.title, p.thumbnail_image
     FROM project_bookings pb
     JOIN projects p ON pb.project_id = p.id
     WHERE pb.user_id = $1
     ORDER BY pb.created_at DESC`,
    [userId]
  );

  res.render("dashboard/userProjects", { bookings: rows });
};

// ACCEPT QUOTATION
exports.acceptQuotation = async (req, res) => {
  const bookingId = req.params.id;

  await pool.query(
    `UPDATE project_bookings
     SET status = 'accepted'
     WHERE id = $1 AND user_id = $2`,
    [bookingId, req.session.user.id]
  );

  res.redirect("/dashboard/projects");
};
