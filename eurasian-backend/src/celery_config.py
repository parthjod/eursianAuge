from celery import Celery

def make_celery(app):
    # Default to local Redis if not set in app.config
    app.config.setdefault('broker_url', 'redis://localhost:6379/0')
    app.config.setdefault('result_backend', 'redis://localhost:6379/0')

    celery = Celery(
        app.import_name,
        backend=app.config['result_backend'],
        broker=app.config['broker_url'],
        include=['src.tasks']
    )

    # Copy Flask app config into Celery
    celery.conf.update(app.config)

    # Ensure Celery tasks run within Flask's app context
    class ContextTask(celery.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery.Task = ContextTask

    return celery
