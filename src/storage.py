import requests
from .models import Course
from typing import Tuple

API_BASE_URL = "http://127.0.0.1:8000"


class Storage:

    @staticmethod
    def get_raw_data(student_id: str) -> dict:
        try:
            res = requests.get(
                f"{API_BASE_URL}/schedule/{student_id}",
                timeout=5
            )

            if res.status_code == 200:
                return res.json().get("data", {})

        except Exception as e:
            print(f"[API]讀取課表失敗:{e}")

        return {}

    @staticmethod
    def authenticate(
        student_id: str,
        password: str
    ) -> Tuple[bool, str]:

        try:

            payload = {
                "student_id": student_id,
                "password": password
            }

            res = requests.post(
                f"{API_BASE_URL}/auth/login",
                json=payload,
                timeout=5
            )

            if res.status_code == 200:

                data = res.json()

                return (
                    data.get("success", False),
                    data.get("message", "")
                )

            return False, "伺服器發生錯誤"

        except Exception as e:

            return False, f"無法連線至驗證伺服器:{e}"

    @staticmethod
    def save_data(
        student_id: str,
        schedule_data: dict,
        staging_area: list = None,
        password: str = None
    ):

        if staging_area is None:
            staging_area = []

        serializable_data = {

            "schedule": {

                sem: [
                    c.to_dict()
                    for c in courses
                ]

                for sem, courses
                in schedule_data.items()

            },

            "staging": [
                c.to_dict()
                for c in staging_area
            ]
        }

        try:

            payload = {

                "student_id": student_id,
                "schedule_data": serializable_data
            }

            requests.post(
                f"{API_BASE_URL}/schedule",
                json=payload,
                timeout=5
            )

        except Exception as e:

            print(f"[API]雲端儲存失敗:{e}")

    @staticmethod
    def reset_password(
        student_id: str,
        otp: str = "",
        new_password: str = None
    ) -> Tuple[bool, str]:

        try:
            if new_password is None:
                new_password = otp
                otp = ""

            payload = {
                "student_id": student_id,
                "new_password": new_password
            }
            if otp:
                payload["otp"] = otp

            res = requests.post(
                f"{API_BASE_URL}/auth/reset-password",
                json=payload,
                timeout=5
            )

            if res.status_code == 200:

                return (
                    True,
                    res.json().get(
                        "message",
                        "重設成功"
                    )
                )

            return (
                False,
                res.json().get(
                    "detail",
                    "重設失敗"
                )
            )

        except Exception as e:

            return False, f"伺服器連線失敗:{e}"

    @staticmethod
    def load_data(
        student_id: str
    ):

        data = Storage.get_raw_data(
            student_id
        )

        if not data:
            return {}

        if (
            "schedule" in data
            and
            "staging" in data
        ):

            return {

                "schedule": {

                    sem: [
                        Course.from_dict(c)
                        for c in courses
                    ]

                    for sem, courses
                    in data["schedule"].items()

                },

                "staging": [

                    Course.from_dict(c)

                    for c
                    in data["staging"]

                ]
            }

        return {

            "schedule": {

                sem: [
                    Course.from_dict(c)
                    for c in courses
                ]

                for sem, courses
                in data.items()

            },

            "staging": []
        }