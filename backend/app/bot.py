import os

from dotenv import load_dotenv
from telegram import Update
from telegram.ext import (
    Application,
    CommandHandler,
    ContextTypes,
    ConversationHandler,
    MessageHandler,
    filters,
)

from app.database import SessionLocal
from app.models import JobApplication
from datetime import date
from app.gemini import extract_job_application
from collections import Counter


load_dotenv()

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "Halo! 👋\n\n"
        "Selamat datang di Job Tracker AI.\n"
        "Ketik /help untuk melihat daftar perintah."
    )


async def help_command(
    update: Update,
    context: ContextTypes.DEFAULT_TYPE
):
    await update.message.reply_text(
        "📋 *Job Tracker AI*\n"
        "Kelola lamaran kerja kamu jadi lebih mudah\n\n"

        "➕ *Tambah Lamaran*\n"
        "/add\n"
        "Tambah lamaran secara manual\n\n"

        "📋 *Lihat Lamaran*\n"
        "/list\n"
        "Lihat detail satu lamaran\n\n"

        "✏️ *Update Lamaran*\n"
        "/update\n"
        "Ubah informasi lamaran\n\n"

        "🔎 *Cari Lamaran*\n"
        "/search\n"
        "Cari lamaran berdasarkan perusahaan, posisi, status, atau sumber\n\n"

        "📊 *Ringkasan*\n"
        "/summary\n"
        "Lihat ringkasan seluruh lamaran\n\n"

        "🗑️ *Hapus Lamaran*\n"
        "/delete\n"
        "Hapus lamaran\n\n"

        "🤖 *AI*\n"
        "Kamu juga bisa mengirim pesan biasa "
        "dan AI akan mencoba memahami informasi lamaranmu.\n\n"

        "Contoh:\n"
        "\"Aku baru apply di Telkom sebagai "
        "Frontend Developer lewat LinkedIn.\"",
        parse_mode="Markdown"
    )


async def list_applications(
    update: Update,
    context: ContextTypes.DEFAULT_TYPE
):
    db = SessionLocal()

    try:
        applications = (
            db.query(JobApplication)
            .order_by(JobApplication.id.desc())
            .all()
        )

        if not applications:
            await update.message.reply_text(
                "📭 Belum ada data lamaran."
            )
            return

        message = "📋 *Daftar Lamaran Kerja*\n\n"

        for application in applications:
            message += (
                f"🆔 {application.id}\n"
                f"🏢 {application.company}\n"
                f"💼 {application.position}\n"
                f"📌 Status: {application.status}\n"
                f"🔎 Source: {application.source or '-'}\n"
                f"📅 Date: {application.date_applied or '-'}\n\n"
            )

        await update.message.reply_text(
            message,
            parse_mode="Markdown"
        )

    finally:
        db.close()

async def add_application(
    update: Update,
    context: ContextTypes.DEFAULT_TYPE
):
    if len(context.args) < 3:
        await update.message.reply_text(
            "❌ Format salah.\n\n"
            "Gunakan:\n"
            "/add perusahaan | posisi | source\n\n"
            "Contoh:\n"
            "/add Telkom Indonesia | Frontend Developer | LinkedIn"
        )
        return

    text = " ".join(context.args)

    parts = [part.strip() for part in text.split("|")]

    if len(parts) != 3:
        await update.message.reply_text(
            "❌ Format salah.\n\n"
            "Gunakan:\n"
            "/add perusahaan | posisi | source"
        )
        return

    company = parts[0]
    position = parts[1]
    source = parts[2]

    db = SessionLocal()

    try:
        new_application = JobApplication(
            company=company,
            position=position,
            source=source,
            status="Applied"
        )

        db.add(new_application)
        db.commit()
        db.refresh(new_application)

        await update.message.reply_text(
            "✅ Lamaran berhasil ditambahkan!\n\n"
            f"🆔 ID: {new_application.id}\n"
            f"🏢 Perusahaan: {new_application.company}\n"
            f"💼 Posisi: {new_application.position}\n"
            f"🔎 Source: {new_application.source}\n"
            f"📌 Status: {new_application.status}"
        )

    finally:
        db.close()

async def detail_application(
    update: Update,
    context: ContextTypes.DEFAULT_TYPE
):
    if len(context.args) != 1:
        await update.message.reply_text(
            "❌ Format salah.\n\n"
            "Gunakan:\n"
            "/detail ID\n\n"
            "Contoh:\n"
            "/detail 5"
        )
        return

    try:
        application_id = int(context.args[0])
    except ValueError:
        await update.message.reply_text(
            "❌ ID harus berupa angka."
        )
        return

    db = SessionLocal()

    try:
        application = (
            db.query(JobApplication)
            .filter(JobApplication.id == application_id)
            .first()
        )

        if application is None:
            await update.message.reply_text(
                f"❌ Lamaran dengan ID {application_id} tidak ditemukan."
            )
            return

        message = (
            "📄 *Detail Lamaran*\n\n"
            f"🆔 ID: {application.id}\n"
            f"🏢 Perusahaan: {application.company}\n"
            f"💼 Posisi: {application.position}\n"
            f"📍 Lokasi: {application.location or '-'}\n"
            f"💼 Tipe: {application.job_type or '-'}\n"
            f"🔎 Source: {application.source or '-'}\n"
            f"🔗 URL: {application.job_url or '-'}\n"
            f"📅 Tanggal Apply: {application.date_applied or '-'}\n"
            f"📌 Status: {application.status}\n"
            f"📝 Notes: {application.notes or '-'}"
        )

        await update.message.reply_text(
            message,
            parse_mode="Markdown"
        )

    finally:
        db.close()

UPDATE_FIELD, UPDATE_VALUE = range(2)


async def start_update(
    update: Update,
    context: ContextTypes.DEFAULT_TYPE
):
    if len(context.args) != 1:
        await update.message.reply_text(
            "❌ Format salah.\n\n"
            "Gunakan:\n"
            "/update ID\n\n"
            "Contoh:\n"
            "/update 5"
        )
        return ConversationHandler.END

    try:
        application_id = int(context.args[0])
    except ValueError:
        await update.message.reply_text(
            "❌ ID lamaran harus berupa angka."
        )
        return ConversationHandler.END

    db = SessionLocal()

    try:
        application = (
            db.query(JobApplication)
            .filter(JobApplication.id == application_id)
            .first()
        )

        if application is None:
            await update.message.reply_text(
                f"❌ Lamaran dengan ID {application_id} tidak ditemukan."
            )
            return ConversationHandler.END

        # Simpan ID lamaran untuk langkah berikutnya
        context.user_data["update_application_id"] = application_id

        await update.message.reply_text(
            f"✏️ *Ubah Lamaran #{application_id}*\n\n"
            f"🏢 {application.company}\n"
            f"💼 {application.position}\n\n"
            "Apa yang ingin kamu ubah?\n\n"
            "1️⃣ Perusahaan\n"
            "2️⃣ Posisi\n"
            "3️⃣ Lokasi\n"
            "4️⃣ Tipe pekerjaan\n"
            "5️⃣ Sumber lamaran\n"
            "6️⃣ Link lowongan\n"
            "7️⃣ Tanggal melamar\n"
            "8️⃣ Status\n"
            "9️⃣ Catatan\n\n"
            "Ketik nomor pilihan.\n"
            "Ketik /cancel untuk membatalkan."
        ,
            parse_mode="Markdown"
        )

        return UPDATE_FIELD

    finally:
        db.close()

async def start_update(
    update: Update,
    context: ContextTypes.DEFAULT_TYPE
):
    if len(context.args) != 1:
        await update.message.reply_text(
            "❌ Format salah.\n\n"
            "Gunakan:\n"
            "/update ID\n\n"
            "Contoh:\n"
            "/update 5"
        )
        return ConversationHandler.END

    try:
        application_id = int(context.args[0])
    except ValueError:
        await update.message.reply_text(
            "❌ ID lamaran harus berupa angka."
        )
        return ConversationHandler.END

    db = SessionLocal()

    try:
        application = (
            db.query(JobApplication)
            .filter(JobApplication.id == application_id)
            .first()
        )

        if application is None:
            await update.message.reply_text(
                f"❌ Lamaran dengan ID {application_id} tidak ditemukan."
            )
            return ConversationHandler.END

        # Simpan ID lamaran untuk langkah berikutnya
        context.user_data["update_application_id"] = application_id

        await update.message.reply_text(
            f"✏️ *Ubah Lamaran #{application_id}*\n\n"
            f"🏢 {application.company}\n"
            f"💼 {application.position}\n\n"
            "Apa yang ingin kamu ubah?\n\n"
            "1️⃣ Perusahaan\n"
            "2️⃣ Posisi\n"
            "3️⃣ Lokasi\n"
            "4️⃣ Tipe pekerjaan\n"
            "5️⃣ Sumber lamaran\n"
            "6️⃣ Link lowongan\n"
            "7️⃣ Tanggal melamar\n"
            "8️⃣ Status\n"
            "9️⃣ Catatan\n\n"
            "Ketik nomor pilihan.\n"
            "Ketik /cancel untuk membatalkan."
        ,
            parse_mode="Markdown"
        )

        return UPDATE_FIELD

    finally:
        db.close()

async def choose_update_field(
    update: Update,
    context: ContextTypes.DEFAULT_TYPE
):
    choice = update.message.text.strip()

    fields = {
        "1": ("company", "🏢 Masukkan nama perusahaan baru:"),
        "2": ("position", "💼 Masukkan posisi baru:"),
        "3": ("location", "📍 Masukkan lokasi baru:"),
        "4": ("job_type", "💼 Masukkan tipe pekerjaan baru:"),
        "5": ("source", "🔎 Masukkan sumber lamaran baru:"),
        "6": ("job_url", "🔗 Masukkan link lowongan baru:"),
        "7": ("date_applied", "📅 Masukkan tanggal melamar baru dengan format YYYY-MM-DD:"),
        "8": ("status", None),
        "9": ("notes", "📝 Masukkan catatan baru:")
    }

    if choice not in fields:
        await update.message.reply_text(
            "❌ Pilihan tidak valid.\n\n"
            "Silakan pilih nomor 1–9."
        )
        return UPDATE_FIELD

    field, question = fields[choice]

    context.user_data["update_field"] = field

    # Kalau yang dipilih STATUS,
    # langsung tampilkan pilihan status.
    if field == "status":
        await update.message.reply_text(
            "📌 *Pilih status baru:*\n\n"
            "1️⃣ Wishlist\n"
            "2️⃣ Sudah Melamar\n"
            "3️⃣ Assessment\n"
            "4️⃣ Interview\n"
            "5️⃣ Offer\n"
            "6️⃣ Ditolak\n"
            "7️⃣ Mengundurkan Diri\n\n"
            "Ketik nomor pilihan."
            ,
            parse_mode="Markdown"
        )

        context.user_data["status_selection"] = True

    else:
        await update.message.reply_text(question)

    return UPDATE_VALUE

async def save_update_value(
    update: Update,
    context: ContextTypes.DEFAULT_TYPE
):
    value = update.message.text.strip()

    application_id = context.user_data.get(
        "update_application_id"
    )

    field = context.user_data.get(
        "update_field"
    )

    # Kalau field yang dipilih adalah status
    if field == "status":

        statuses = {
            "1": "Wishlist",
            "2": "Sudah Melamar",
            "3": "Assessment",
            "4": "Interview",
            "5": "Offer",
            "6": "Ditolak",
            "7": "Mengundurkan Diri"
        }

        if value not in statuses:
            await update.message.reply_text(
                "❌ Pilihan status tidak valid.\n\n"
                "Silakan pilih nomor 1–7."
            )
            return UPDATE_VALUE

        value = statuses[value]

    # Validasi tanggal
    if field == "date_applied":
        from datetime import date

        try:
            value = date.fromisoformat(value)
        except ValueError:
            await update.message.reply_text(
                "❌ Format tanggal tidak valid.\n\n"
                "Gunakan format:\n"
                "YYYY-MM-DD\n\n"
                "Contoh:\n"
                "2026-09-28"
            )
            return UPDATE_VALUE

    db = SessionLocal()

    try:
        application = (
            db.query(JobApplication)
            .filter(JobApplication.id == application_id)
            .first()
        )

        if application is None:
            await update.message.reply_text(
                "❌ Data lamaran tidak ditemukan."
            )
            return ConversationHandler.END

        setattr(application, field, value)

        db.commit()
        db.refresh(application)

        await update.message.reply_text(
            "✅ *Lamaran berhasil diperbarui!*\n\n"
            f"🆔 ID: {application.id}\n"
            f"🏢 Perusahaan: {application.company}\n"
            f"💼 Posisi: {application.position}\n"
            f"📌 Status: {application.status}\n"
            f"🔎 Sumber: {application.source or '-'}\n"
            f"📅 Tanggal melamar: {application.date_applied or '-'}",
            parse_mode="Markdown"
        )

        # Bersihkan data percakapan
        context.user_data.pop("update_application_id", None)
        context.user_data.pop("update_field", None)
        context.user_data.pop("status_selection", None)

        return ConversationHandler.END

    finally:
        db.close()

async def cancel_update(
    update: Update,
    context: ContextTypes.DEFAULT_TYPE
):
    context.user_data.pop("update_application_id", None)
    context.user_data.pop("update_field", None)
    context.user_data.pop("status_selection", None)

    await update.message.reply_text(
        "❌ Perubahan dibatalkan."
    )

    return ConversationHandler.END

async def search_applications(
    update: Update,
    context: ContextTypes.DEFAULT_TYPE
):
    if not context.args:
        await update.message.reply_text(
            "❌ Masukkan kata kunci.\n\n"
            "Contoh:\n"
            "/search Telkom\n"
            "/search Frontend\n"
            "/search Interview\n"
            "/search LinkedIn"
        )
        return

    keyword = " ".join(context.args)

    db = SessionLocal()

    try:
        applications = (
            db.query(JobApplication)
            .filter(
                (JobApplication.company.ilike(f"%{keyword}%")) |
                (JobApplication.position.ilike(f"%{keyword}%")) |
                (JobApplication.status.ilike(f"%{keyword}%")) |
                (JobApplication.source.ilike(f"%{keyword}%")) |
                (JobApplication.notes.ilike(f"%{keyword}%"))
            )
            .order_by(JobApplication.id.desc())
            .all()
        )

        if not applications:
            await update.message.reply_text(
                f"🔍 Tidak ditemukan lamaran dengan kata kunci: {keyword}"
            )
            return

        message = (
            f"🔎 *Hasil pencarian: {keyword}*\n\n"
        )

        for application in applications:
            message += (
                f"🆔 {application.id}\n"
                f"🏢 {application.company}\n"
                f"💼 {application.position}\n"
                f"📌 {application.status}\n"
                f"🔎 {application.source or '-'}\n\n"
            )

        await update.message.reply_text(
            message,
            parse_mode="Markdown"
        )

    finally:
        db.close()

async def summary_applications(
    update: Update,
    context: ContextTypes.DEFAULT_TYPE
):
    db = SessionLocal()

    try:
        applications = (
            db.query(JobApplication)
            .order_by(JobApplication.id.desc())
            .all()
        )

        if not applications:
            await update.message.reply_text(
                "📭 Belum ada data lamaran."
            )
            return

        # Menghitung jumlah berdasarkan status
        status_counter = Counter(
            application.status
            for application in applications
        )

        # Menghitung jumlah berdasarkan source
        source_counter = Counter(
            application.source.strip()
            if application.source and application.source.strip()
            else "Tidak disebutkan"
            for application in applications
        )

        message = (
            "📊 *RINGKASAN LAMARAN*\n\n"
            f"📋 Total Lamaran: *{len(applications)}*\n\n"
            "📌 *STATUS*\n"
        )

        # Status
        for status, count in status_counter.items():
            message += f"• {status}: {count}\n"

        message += "\n🔎 *SUMBER LAMARAN*\n"

        # Source
        for source, count in source_counter.most_common():
            message += f"• {source}: {count}\n"

        await update.message.reply_text(
            message,
            parse_mode="Markdown"
        )

    finally:
        db.close()                       

async def handle_message(
    update: Update,
    context: ContextTypes.DEFAULT_TYPE
):
    user_text = update.message.text

    await update.message.reply_text(
        "🤖 Sedang memahami pesan kamu..."
    )

    try:
        result = extract_job_application(user_text)

        if not result.is_job_application:
            await update.message.reply_text(
                "❌ Aku belum mendeteksi informasi lamaran kerja dari pesan kamu.\n\n"
                "Coba tulis seperti:\n"
                "\"Aku baru apply di Telkom sebagai Frontend Developer lewat LinkedIn.\""
            )
            return

        if not result.company or not result.position:
            await update.message.reply_text(
                "⚠️ Aku mendeteksi ini sebagai informasi lamaran, "
                "tapi datanya belum lengkap.\n\n"
                "Minimal sebutkan nama perusahaan dan posisi."
            )
            return

        db = SessionLocal()

        try:
            application = JobApplication(
                company=result.company,
                position=result.position,
                source=result.source,
                date_applied=(
                    date.fromisoformat(result.date_applied)
                    if result.date_applied
                    else date.today()
                ),
                status="Applied"
            )

            db.add(application)
            db.commit()
            db.refresh(application)

            await update.message.reply_text(
                "✅ Lamaran berhasil ditambahkan!\n\n"
                f"🆔 ID: {application.id}\n"
                f"🏢 Perusahaan: {application.company}\n"
                f"💼 Posisi: {application.position}\n"
                f"🔎 Source: {application.source or '-'}\n"
                f"📅 Tanggal: {application.date_applied}\n"
                f"📌 Status: {application.status}"
            )

        finally:
            db.close()

    except Exception as e:
        print("Gemini error:", e)

        await update.message.reply_text(
            "❌ Maaf, terjadi kesalahan saat memproses pesan."
        )

async def delete_application(
    update: Update,
    context: ContextTypes.DEFAULT_TYPE
):
    if len(context.args) != 1:
        await update.message.reply_text(
            "❌ Format salah.\n\n"
            "Gunakan:\n"
            "/delete ID\n\n"
            "Contoh:\n"
            "/delete 5"
        )
        return

    try:
        application_id = int(context.args[0])
    except ValueError:
        await update.message.reply_text(
            "❌ ID lamaran harus berupa angka."
        )
        return

    db = SessionLocal()

    try:
        application = (
            db.query(JobApplication)
            .filter(JobApplication.id == application_id)
            .first()
        )

        if application is None:
            await update.message.reply_text(
                f"❌ Lamaran dengan ID {application_id} tidak ditemukan."
            )
            return

        company = application.company
        position = application.position

        db.delete(application)
        db.commit()

        await update.message.reply_text(
            "🗑️ *Lamaran berhasil dihapus!*\n\n"
            f"🏢 {company}\n"
            f"💼 {position}",
            parse_mode="Markdown"
        )

    finally:
        db.close()

def create_bot():
    application = Application.builder().token(
        TELEGRAM_BOT_TOKEN
    ).build()

    # COMMAND HANDLER

    application.add_handler(
        CommandHandler("start", start)
    )

    application.add_handler(
        CommandHandler("help", help_command)
    )

    application.add_handler(
        CommandHandler("list", list_applications)
    )

    application.add_handler(
        CommandHandler("add", add_application)
    )

    application.add_handler(
        CommandHandler("detail", detail_application)
    )

    application.add_handler(
        CommandHandler("delete", delete_application)
    )

    # UPDATE CONVERSATION

    update_conversation = ConversationHandler(
        entry_points=[
            CommandHandler("update", start_update)
        ],

        states={
            UPDATE_FIELD: [
                MessageHandler(
                    filters.TEXT & ~filters.COMMAND,
                    choose_update_field
                )
            ],

            UPDATE_VALUE: [
                MessageHandler(
                    filters.TEXT & ~filters.COMMAND,
                    save_update_value
                )
            ],
        },

        fallbacks=[
            CommandHandler("cancel", cancel_update)
        ],
    )

    application.add_handler(
        update_conversation
    )

    # SEARCH & SUMMARY

    application.add_handler(
        CommandHandler("search", search_applications)
    )

    application.add_handler(
        CommandHandler("summary", summary_applications)
    )

    # PESAN BIASA → GEMINI

    application.add_handler(
        MessageHandler(
            filters.TEXT & ~filters.COMMAND,
            handle_message
        )
    )

    return application


if __name__ == "__main__":
    bot = create_bot()

    print("Telegram bot is running...")

    bot.run_polling()