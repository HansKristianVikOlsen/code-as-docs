FROM squidfunk/mkdocs-material as BUILD
RUN pip3 install mkdocs-mermaid-plugin
RUN pip3 install mkdocs-git-revision-date-plugin
RUN pip3 install mkdocs-macros-plugin
RUN pip3 install mkdocs-video
WORKDIR /mkdocs
COPY . .
RUN mkdocs build

FROM nginxinc/nginx-unprivileged
COPY --from=BUILD ./mkdocs/site ./usr/share/nginx/html
EXPOSE 8080