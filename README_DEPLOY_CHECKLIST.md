# Deployment checklist

- [ ] Add `backend/` folder to GitHub repository and push.
- [ ] Create separate Render Web Service; do not delete or change existing static site.
- [ ] Set Root Directory to `backend`.
- [ ] Set build command `pip install -r requirements.txt`.
- [ ] Set start command `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
- [ ] Create PostgreSQL database and configure `DATABASE_URL`.
- [ ] Set unique `JWT_SECRET` and private `REGISTRATION_CODE`.
- [ ] Set exact `FRONTEND_ORIGINS` from existing frontend's live URL.
- [ ] Configure a separately hosted, reachable Ollama endpoint and install model there.
- [ ] Verify `/health` and `/docs`.
- [ ] Test register/login/upload/list/chat/summary/compare/delete with test documents.
- [ ] Integrate frontend API calls only after backend tests pass.
- [ ] Review current hosting costs, data retention, privacy, rate limits, and backups before real users upload sensitive documents.
