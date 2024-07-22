FROM python:3.11
WORKDIR /usr/langchat/src
COPY ["./api/", "."]
RUN pip install pipenv
RUN pipenv install --deploy --ignore-pipfile
CMD ["pipenv", "run", "uvicorn", "main:app", "--host"]