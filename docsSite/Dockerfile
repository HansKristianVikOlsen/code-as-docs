FROM squidfunk/mkdocs-material

RUN pip3 install mkdocs-mermaid-plugin
RUN pip3 install mkdocs-git-revision-date-plugin
RUN pip3 install mkdocs-macros-plugin
RUN pip3 install mkdocs-video

WORKDIR /docs

COPY . .

EXPOSE 8000

# CMD ["serve", "-a", "0.0.0.0:8000"]
CMD ["mkDocs", "build"]
CMD ["mkDocs", "serve"]