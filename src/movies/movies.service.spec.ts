import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array', () => {
      const result = service.getAll();

      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getOne', () => {
    let movie: any;

    beforeEach(() => {
      service.create({
        title: 'Test Movie',
        year: 2021,
        genres: ['Action', 'Adventure'],
      });

      movie = service.getOne(1);
    });

    it('should return a movie', () => {
      expect(movie).toBeDefined();
    });

    it('should throw 404 error', () => {
      try {
        service.getOne(9999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('deleteOne', () => {
    it('delete a movie', () => {
      service.create({
        title: 'Test Movie',
        year: 2021,
        genres: ['Action', 'Adventure'],
      });
      const allMovies = service.getAll();
      service.deleteOne(1);
      const afterDelete = service.getAll();
      expect(afterDelete).toHaveLength(allMovies.length - 1);
      expect(afterDelete).toEqual([]);
    });

    it('shoud return a 404', () => {
      try {
        service.deleteOne(9999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('create', () => {
    it('should create a movie', () => {
      service.create({
        title: 'Test Movie',
        year: 2021,
        genres: ['Action', 'Adventure'],
      });
      const afterCreate = service.getAll();
      expect(afterCreate[afterCreate.length - 1].title).toEqual('Test Movie');
    });
  });

  describe('update', () => {
    it('should update a movie', () => {
      service.create({
        title: 'Test Movie',
        year: 2021,
        genres: ['Action', 'Adventure'],
      });

      service.update(1, { title: 'Updated Movie' });
      const updatedMovie = service.getOne(1);
      expect(updatedMovie.title).toEqual('Updated Movie');
    });

    it('should throw a NotFoundException', () => {
      try {
        service.update(9999, {});
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
