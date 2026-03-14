from .entities.entity import Session, engine, Base


def main():
    # generate database schema
    Base.metadata.create_all(engine)
    # start session
    session = Session()

if __name__ == "__main__":
    main()