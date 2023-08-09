from .base import *  # noqa

SECRET_KEY = "xyzabcdefghu"

INSTALLED_APPS += [  # noqa F405
    "whitenoise.runserver_nostatic",
    "debug_toolbar",
    "django_extensions",
]


ALLOWED_HOSTS = ["*"]

INTERNAL_IPS = [
    "127.0.0.1",
]

MIDDLEWARE = (
    MIDDLEWARE[:1]  # noqa
    + [
        "debug_toolbar.middleware.DebugToolbarMiddleware",
    ]
    + MIDDLEWARE[1:]  # noqa
)
