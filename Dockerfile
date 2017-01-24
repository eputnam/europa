FROM openjdk:8

ADD target/dependency/*.jar target/*.jar /europa/lib/
ADD run /europa/run
ADD public /europa/public

EXPOSE 8080
WORKDIR /europa

CMD ["./run"]
