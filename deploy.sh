aws s3 sync --region eu-west-1 --quiet --delete ./dist "s3://$1" && \
export AWS_MAX_ATTEMPTS=10 && \
aws cloudfront create-invalidation --region eu-west-1 --paths "/*" --distribution-id $2
