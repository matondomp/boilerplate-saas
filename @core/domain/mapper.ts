export abstract class Mapper<Domain, Persistence> {
  abstract toDomain(data: Persistence): Domain
  abstract toPersistence(data: Domain): Persistence | Promise<Persistence>
}
