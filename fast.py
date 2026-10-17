import mimetypes
import tempfile
from pathlib import Path

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from ultralytics import YOLO
from typing import Annotated

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
      "http://localhost:5173",
      "https://shuttleapi-five.vercel.app/"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = YOLO("best.pt")


@app.post("/predict/image")
async def predict_image(file: Annotated[UploadFile, File(media_type="image/jpeg,image/png")]):
    suffix = Path(file.filename).suffix.lower()

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await file.read())
        tmp.flush()

        tmp_path = tmp.name

    results = model.predict(tmp_path, conf=0.25, save=True)

    saved_path = Path(results[0].save_dir) / Path(tmp_path).name
    media_type = mimetypes.guess_type(saved_path)[0] or 'application/octet-stream'

    return FileResponse(
        str(saved_path),
        filename=f"annotated_{file.filename}",
        media_type=media_type,
    )


@app.post("/predict/video")
async def predict_video(file: UploadFile = File(...)):
    suffix = Path(file.filename).suffix.lower()

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await file.read())
        tmp.flush()

        tmp_path = tmp.name

    results = model.track(source=tmp_path, stream=True, persist=True, conf=0.25, save=True)

    save_dir = None
    for r in results:
        save_dir = r.save_dir

    saved_video = next(Path(save_dir).glob("*"))
    media_type = mimetypes.guess_type(saved_video)[0] or 'application/octet-stream'

    return FileResponse(
        str(saved_video),
        filename=f"annotated_{file.filename}",
        media_type=media_type,
    )
